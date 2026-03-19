const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Operator Panel E2E Tests', function() {
    this.timeout(60000);
    let driver;

    const OPERATOR_USER = {
        email: 'testOperator@example.com',
        password: '483379',
        verificationCode: '1234'
    };
    const BASE_URL = 'http://localhost:5173';

    before(async function() {
        const chrome = require('selenium-webdriver/chrome');
        const options = new chrome.Options();
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--window-size=1920,1080');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        console.log('\n--- [OPERATOR] Авторизация ---');
        await driver.get(`${BASE_URL}/login`);

        // Используем wait для ожидания элементов
        let emailInput = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 5000);
        await emailInput.sendKeys(OPERATOR_USER.email);

        let passwordInput = await driver.wait(until.elementLocated(By.css('input[type="password"]')), 5000);
        await passwordInput.sendKeys(OPERATOR_USER.password);

        let loginBtn = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 5000);
        await loginBtn.click();

        console.log('--- [OPERATOR] Ввод кода ---');
        let codeInput = await driver.wait(until.elementLocated(By.css('input[placeholder="- - - -"]')), 10000);
        await codeInput.sendKeys(OPERATOR_USER.verificationCode);

        let verifyBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Подтвердить')]")), 5000);
        await verifyBtn.click();

        await driver.wait(async () => {
            const currentUrl = await driver.getCurrentUrl();
            return currentUrl.includes('/operator');
        }, 10000);
        console.log('--- [OPERATOR] Успешный вход ---');
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    describe('Ticket List Management', function() {

        beforeEach(async function() {
            await driver.get(`${BASE_URL}/operator/tickets`);
            // Ждем заголовок страницы
            await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Все обращения')]")), 5000);
        });

        it('should display the ticket list or empty message', async function() {
            // Проверяем наличие ИЛИ таблицы, ИЛИ сообщения о пустоте
            // Используем findElements (возвращает массив, не падает)
            const tableHeaders = await driver.findElements(By.css('th'));
            const emptyMessages = await driver.findElements(By.xpath("//p[contains(text(), 'Обращений не найдено')]"));

            const hasTable = tableHeaders.length > 0;
            const hasEmptyMsg = emptyMessages.length > 0;

            expect(hasTable || hasEmptyMsg).to.be.true;
        });

        it('should search by text and reset', async function() {
            // 1. Ждем поле поиска
            let searchInput = await driver.wait(
                until.elementLocated(By.css('input[placeholder="Поиск по теме или описанию..."]')),
                5000
            );

            await searchInput.sendKeys('Тест');

            // 2. Кликаем Найти
            let searchBtn = await driver.wait(
                until.elementLocated(By.xpath("//button[contains(text(), 'Найти')]")),
                5000
            );
            await searchBtn.click();

            // Ждем завершения загрузки (пауза, чтобы успел пройти рендер "Загрузка...")
            await driver.sleep(1000);

            // 3. Кликаем Сбросить
            let resetBtn = await driver.wait(
                until.elementLocated(By.xpath("//button[contains(text(), 'Сбросить')]")),
                5000
            );
            await resetBtn.click();

            // 4. ВАЖНО: Снова ждем появления поля поиска!
            // Потому что при Сбросе компонент перерисовывается (Loading...)
            let searchInputAfterReset = await driver.wait(
                until.elementLocated(By.css('input[placeholder="Поиск по теме или описанию..."]')),
                5000
            );

            const inputVal = await searchInputAfterReset.getAttribute('value');
            expect(inputVal).to.equal('');
        });

        it('should filter by status', async function() {
            // ИСПРАВЛЕНО: wait для селекта
            const statusSelect = await driver.wait(
                until.elementLocated(By.xpath("//label[contains(text(), 'Статус')]/..//select")),
                5000
            );
            await statusSelect.sendKeys('Новые');
            await driver.sleep(500);

            // Просто проверяем, что таблица на месте
            const table = await driver.wait(
                until.elementLocated(By.css('table')),
                5000
            );
            expect(await table.isDisplayed()).to.be.true;
        });

        it('should toggle "Show only mine" checkbox', async function() {
            // ИСПРАВЛЕНО: wait для спана с текстом
            const checkboxLabel = await driver.wait(
                until.elementLocated(By.xpath("//span[contains(text(), 'Показать только назначенные мне')]")),
                5000
            );

            // Кликаем по лейблу (это надежнее в React приложениях)
            await driver.executeScript("arguments[0].click();", checkboxLabel);
            await driver.sleep(500);

            // Проверяем, что чекбокс нажат
            const checkbox = await driver.wait(
                until.elementLocated(By.xpath("//input[@type='checkbox']")),
                5000
            );

            const isChecked = await checkbox.isSelected();
            expect(isChecked).to.be.true;
        });
    });
});