const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const fs = require('fs');

describe('Admin Panel E2E Tests', function() {
    this.timeout(60000);
    let driver;

    // --- КОНФИГУРАЦИЯ ---
    const TEST_USER = {
        email: 'testAdmin@example.com',
        password: '450092',
        verificationCode: '1234'
    };
    const BASE_URL = 'http://localhost:5173';
    // --------------------

    // === ГЛОБАЛЬНАЯ АВТОРИЗАЦИЯ ===
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

        console.log('\n--- [GLOBAL] Авторизация ---');

        await driver.get(`${BASE_URL}/login`);
        let emailInput = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 5000);
        await emailInput.sendKeys(TEST_USER.email);
        await driver.findElement(By.css('input[type="password"]')).sendKeys(TEST_USER.password);
        await driver.findElement(By.css('button[type="submit"]')).click();

        let codeInput = await driver.wait(until.elementLocated(By.css('input[placeholder="- - - -"]')), 10000);
        await codeInput.sendKeys(TEST_USER.verificationCode);
        await driver.findElement(By.xpath("//button[contains(text(), 'Подтвердить')]")).click();

        await driver.wait(async () => {
            const url = await driver.getCurrentUrl();
            return !url.includes('/login') && !url.includes('/verify');
        }, 10000);

        console.log('--- [GLOBAL] Успешный вход ---');
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    // ==========================================
    // === БЛОК 1: КАТЕГОРИИ ===
    // ==========================================
    describe('Categories Management', function() {
        const UNIQUE_NAME = `Cat ${Date.now()}`;
        const UPDATED_NAME = `Upd Cat ${Date.now()}`;

        before(async function() {
            await driver.get(`${BASE_URL}/admin/categories`);
            await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Категории')]")), 5000);
        });

        it('should create a category', async function() {
            const nameInput = await driver.findElement(By.css('input[placeholder="Название категории"]'));
            const descInput = await driver.findElement(By.css('input[placeholder="Краткое описание"]'));
            const submitBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Создать')]"));

            await nameInput.sendKeys(UNIQUE_NAME);
            await descInput.sendKeys('Описание');
            await submitBtn.click();

            // Даем время на запрос к БД
            await driver.sleep(1000);

            const cell = await driver.wait(
                until.elementLocated(By.xpath(`//td[text()='${UNIQUE_NAME}']`)),
                10000 // Увеличили таймаут до 10 сек
            );
            expect(await cell.getText()).to.equal(UNIQUE_NAME);
        });

        it('should edit the category', async function() {
            const editBtn = await driver.wait(
                until.elementLocated(By.xpath(`//td[text()='${UNIQUE_NAME}']/parent::tr//button[contains(text(), 'Изменить')]`)),
                5000
            );
            await editBtn.click();

            const updateBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Обновить')]")), 3000);

            const nameInput = await driver.findElement(By.css('input[placeholder="Название категории"]'));
            await nameInput.clear();
            await nameInput.sendKeys(UPDATED_NAME);

            await updateBtn.click();

            await driver.sleep(1000);

            const cell = await driver.wait(until.elementLocated(By.xpath(`//td[text()='${UPDATED_NAME}']`)), 5000);
            expect(await cell.getText()).to.equal(UPDATED_NAME);
        });

        it('should delete the category', async function() {
            const deleteBtn = await driver.wait(
                until.elementLocated(By.xpath(`//td[text()='${UPDATED_NAME}']/parent::tr//button[contains(text(), 'Удалить')]`)),
                5000
            );
            await deleteBtn.click();

            await driver.wait(until.alertIsPresent(), 3000);
            await (await driver.switchTo().alert()).accept();

            await driver.sleep(500);
            const items = await driver.findElements(By.xpath(`//td[text()='${UPDATED_NAME}']`));
            expect(items.length).to.equal(0);
        });
    });

    // ==========================================
    // === БЛОК 2: FAQ ===
    // ==========================================
    describe('FAQ Management', function() {
        const UNIQUE_TITLE = `FAQ ${Date.now()}`;
        const UPDATED_TITLE = `Upd FAQ ${Date.now()}`;

        before(async function() {
            await driver.get(`${BASE_URL}/admin/faq`);
            await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'База знаний')]")), 5000);
        });

        it('should create a FAQ article', async function() {
            const titleInput = await driver.findElement(By.css('input[placeholder="Тема вопроса"]'));
            const contentTextarea = await driver.findElement(By.css('textarea[placeholder="Развернутый ответ..."]'));
            const submitBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Опубликовать')]"));

            await titleInput.sendKeys(UNIQUE_TITLE);
            await contentTextarea.sendKeys('Текст ответа');
            await submitBtn.click();

            const cell = await driver.wait(until.elementLocated(By.xpath(`//td[text()='${UNIQUE_TITLE}']`)), 5000);
            expect(await cell.getText()).to.equal(UNIQUE_TITLE);
        });

        it('should edit the FAQ article', async function() {
            const editBtn = await driver.findElement(By.xpath(`//td[text()='${UNIQUE_TITLE}']/parent::tr//button[contains(text(), 'Изменить')]`));
            await editBtn.click();

            const updateBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Обновить')]")), 3000);

            const titleInput = await driver.findElement(By.css('input[placeholder="Тема вопроса"]'));
            await titleInput.clear();
            await titleInput.sendKeys(UPDATED_TITLE);

            await updateBtn.click();

            const cell = await driver.wait(until.elementLocated(By.xpath(`//td[text()='${UPDATED_TITLE}']`)), 5000);
            expect(await cell.getText()).to.equal(UPDATED_TITLE);
        });

        it('should delete the FAQ article', async function() {
            const deleteBtn = await driver.findElement(By.xpath(`//td[text()='${UPDATED_TITLE}']/parent::tr//button[contains(text(), 'Удалить')]`));
            await deleteBtn.click();

            await driver.wait(until.alertIsPresent(), 3000);
            await (await driver.switchTo().alert()).accept();

            await driver.sleep(500);
            const items = await driver.findElements(By.xpath(`//td[text()='${UPDATED_TITLE}']`));
            expect(items.length).to.equal(0);
        });
    });

    // ==========================================
    // === БЛОК 3: ПОЛЬЗОВАТЕЛИ ===
    // ==========================================
    describe('Users Management', function() {
        const UNIQUE_EMAIL = `user_${Date.now()}@test.com`;
        const UNIQUE_NAME = `Тестовый Юзер ${Date.now()}`;
        const UPDATED_NAME = `Обновленный Юзер ${Date.now()}`;

        before(async function() {
            await driver.get(`${BASE_URL}/admin/users`);
            await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Пользователи')]")), 5000);
        });

        it('should create a new user', async function() {
            const createBtn = await driver.wait(
                until.elementLocated(By.xpath("//button[contains(., '+ Создать пользователя')]")),
                5000
            );
            await createBtn.click();

            await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Создание')]")), 5000);

            const nameInput = await driver.findElement(By.css('input[name="fullName"]'));
            const emailInput = await driver.findElement(By.css('input[name="email"]'));
            const passInput = await driver.findElement(By.css('input[name="password"]'));
            const roleSelect = await driver.findElement(By.css('select[name="role"]'));

            await nameInput.sendKeys(UNIQUE_NAME);
            await emailInput.sendKeys(UNIQUE_EMAIL);
            await passInput.sendKeys('password123');
            await roleSelect.sendKeys('Operator');

            await driver.findElement(By.xpath("//button[@type='submit' and contains(., 'Сохранить')]")).click();

            const userCell = await driver.wait(
                until.elementLocated(By.xpath(`//td[text()='${UNIQUE_EMAIL}']`)),
                5000
            );
            expect(await userCell.getText()).to.equal(UNIQUE_EMAIL);
        });

        it('should edit the user name', async function() {
            const editBtn = await driver.wait(
                until.elementLocated(By.xpath(`//td[text()='${UNIQUE_EMAIL}']/parent::tr//button[contains(text(), 'Изменить')]`)),
                5000
            );
            await editBtn.click();

            await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Редактирование')]")), 3000);

            const nameInput = await driver.findElement(By.css('input[name="fullName"]'));
            await nameInput.clear();
            await nameInput.sendKeys(UPDATED_NAME);

            await driver.findElement(By.xpath("//button[@type='submit' and contains(., 'Сохранить')]")).click();

            const nameCell = await driver.wait(
                until.elementLocated(By.xpath(`//td[text()='${UPDATED_NAME}']`)),
                5000
            );
            expect(await nameCell.getText()).to.equal(UPDATED_NAME);
        });

        it('should block the user', async function() {
            const blockBtn = await driver.wait(
                until.elementLocated(By.xpath(`//td[text()='${UPDATED_NAME}']/parent::tr//button[contains(text(), 'Заблокировать')]`)),
                5000
            );
            await blockBtn.click();
            await driver.sleep(1000);

            const statusSpan = await driver.wait(
                until.elementLocated(By.xpath(`//td[text()='${UPDATED_NAME}']/parent::tr//span[contains(text(), 'Заблокирован')]`)),
                5000
            );
            expect(await statusSpan.isDisplayed()).to.be.true;
        });

        it('should unblock the user', async function() {
            const unblockBtn = await driver.wait(
                until.elementLocated(By.xpath(`//td[text()='${UPDATED_NAME}']/parent::tr//button[contains(text(), 'Разблокировать')]`)),
                5000
            );
            await unblockBtn.click();
            await driver.sleep(1000);

            const statusSpan = await driver.wait(
                until.elementLocated(By.xpath(`//td[text()='${UPDATED_NAME}']/parent::tr//span[contains(text(), 'Активен')]`)),
                5000
            );
            expect(await statusSpan.isDisplayed()).to.be.true;
        });
    });

    // ==========================================
    // === БЛОК 4: ОТЧЕТЫ ===
    // ==========================================
    describe('Reports Management', function() {

        before(async function() {
            await driver.get(`${BASE_URL}/admin/reports`);
            await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Отчеты')]")), 5000);
        });

        it('should generate report with default filters and display summary', async function() {
            // По умолчанию даты ставятся текущие, просто нажимаем "Сформировать"
            const generateBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Сформировать')]"));
            await generateBtn.click();

            // 1. Проверяем, что блок сводки (Summary) отобразился
            // Ищем карточку "Всего обращений"
            const totalCard = await driver.wait(
                until.elementLocated(By.xpath("//h4[contains(text(), 'Всего обращений')]")),
                5000
            );
            expect(await totalCard.isDisplayed()).to.be.true;

            // Проверяем, что таблица детализации появилась (ищем заголовок ID)
            const tableHeader = await driver.wait(
                until.elementLocated(By.xpath("//th[contains(text(), 'ID')]")),
                5000
            );
            expect(await tableHeader.isDisplayed()).to.be.true;
        });

        it('should filter by status and update table', async function() {
            // Выбираем статус "New" в селекте
            const statusSelect = await driver.findElement(By.css('select[name="status"]'));
            await statusSelect.sendKeys('New');

            // Нажимаем сформировать
            await driver.findElement(By.xpath("//button[contains(text(), 'Сформировать')]")).click();

            // Ждем обновления таблицы.
            // ВАЖНО: Если фильтр вернет 0 записей, tbody будет пустым и его высота будет 0.
            const tableHeader = await driver.wait(
                until.elementLocated(By.xpath("//th[contains(text(), 'ID')]")),
                5000
            );
            expect(await tableHeader.isDisplayed()).to.be.true;
        });

        it('should have export buttons visible', async function() {
            // Просто проверяем, что кнопки экспорта существуют и кликабельны
            const excelBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Excel')]"));
            const csvBtn = await driver.findElement(By.xpath("//button[contains(text(), 'CSV')]"));

            expect(await excelBtn.isDisplayed()).to.be.true;
            expect(await csvBtn.isDisplayed()).to.be.true;
        });
    });
});