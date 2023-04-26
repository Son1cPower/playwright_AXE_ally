import { test, defineConfig, Browser, BrowserContext, chromium, firefox } from '@playwright/test';
import { Page } from 'playwright';
import { injectAxe } from "axe-playwright";
import AxeBuilder from '@axe-core/playwright';
const { expect } = require('chai')

import writeJsonToFile from "../utils/writeJson";
import readJsonFile from "../utils/readJson";
import createReport from "../utils/createReport";

let browser: Browser
let page: Page
let context: BrowserContext
const URL: string = 'https://tester.test.io/'
const Email = 'negriystas@icloud.com'
const Password = 'WroclaW2023!@'


test.describe('Playwright web page accessibility test', async () => {
    test.beforeEach(async () => {
        // @ts-ignore
        // browser = await chromium.launch(defineConfig)
        browser = await firefox.launch({
            headless: false,
        })
        context = await browser.newContext()
        page = await context.newPage();
        await page.goto(URL)
        await injectAxe(page)
    })

    test(`For Add device flow`, async () => {


        const EmailFild = await page.locator('#user_email');
        const PasswordFild = await page.locator('#user_password');
        const SignInButton = await page.locator("input[value='Sign In']");
        await EmailFild.fill(Email);
        await PasswordFild.fill(Password);
        await SignInButton.click();

        const url = await page.url()
        expect(url).to.equal('https://tester.test.io/')

        const logo = await page.locator("img[title='test IO']")
        await logo.click();

        const your_Devices = await page.locator("a[class='testio-nav-item hidden-xs-down'] span[class='icon icon-devices mr-0']")
        await your_Devices.click();

        //const button_add_Device = await page.locator(".icon.icon-xl.icon-plus-xl")
        await setTimeout(() => {
            const button_add_Device = page.locator(".icon.icon-xl.icon-plus-xl")
            button_add_Device.click();
        }, 2000);
        //await button_add_Device.click();


        const modal_content = await page.locator(".modal-content")
        const computers_Device = await modal_content.locator(".icon.icon-computer-lg.icon-lg")
        await computers_Device.click();


        const Search_for_your_operating_system = await modal_content.locator("#device_search")
        await Search_for_your_operating_system.fill("Windows");



        const osVersion = await modal_content.locator("b[role='presentation']")
        await osVersion.click()
        const windows_11_version = await modal_content.locator("#select2-os_version-result-ybbi-566")
        await windows_11_version.click()



        const browserVersion = await modal_content.locator("label[data-title='Chrome']")
        await browserVersion.click()

        const button_modal_add_device = await modal_content.locator("button[class='btn btn-primary']")
        await button_modal_add_device.click()












        const reportRes = await new AxeBuilder({ page })
            .withTags([
                'wcag2a',
                'wcag2aa',
                'wcag2aaa',
                'wcag21aa',
                'wcag21a',
                'wcag22aa'])
            .withRules(['html-lang', 'image-alt', 'aria-allowed-attr', 'tab-index', 'area-alt', 'aria-allowed-attr', 'aria-command-name', 'aria-hidden-body', 'aria-hidden-focus', 'aria-input-field-name', 'aria-meter-name', 'aria-progressbar-name', 'aria-required-attr', 'aria-required-children', 'aria-required-parent', 'aria-roledescription', 'aria-roles', 'aria-toggle-field-name', 'aria-tooltip-name', 'aria-valid-attr-value', 'aria-valid-attr', 'audio-caption', 'blink', 'button-name', 'bypass', 'color-contrast', 'definition-list', 'dlitem', 'document-title', 'duplicate-id-active', 'duplicate-id-aria', 'duplicate-id', 'form-field-multiple-labels', 'frame-focusable-content', 'frame-title-unique', 'frame-title', 'html-has-lang', 'html-lang-valid', 'html-xml-lang-mismatch', 'image-alt', 'input-button-name', 'input-image-alt', 'label', 'link-in-text-block', 'link-name', 'list', 'listitem', 'marquee', 'meta-refresh', 'meta-viewport', 'nested-interactive', 'no-autoplay-audio', 'object-alt', 'role-img-alt', 'scrollable-region-focusable', 'select-name', 'server-side-image-map', 'svg-img-alt', 'td-headers-attr', 'th-has-data-cells', 'valid-lang', 'video-caption', 'autocomplete-valid', 'avoid-inline-spacing', 'target-size'])

            .options({
                preload: true,
                iframes: true,
                reporter: 'v2',
                resultTypes: ['inapplicable', 'inapplicable', 'passes', 'violations']
            }).analyze();

        const fileName = "AxiosResultsTest.json";

        writeJsonToFile(reportRes, fileName);
        const jsonFile = await readJsonFile(fileName);
        createReport(jsonFile, fileName);


        // console.log(reportRes)
        //console.log('')
    })








    test.afterEach(async () => {
        await browser.close()
    })
})
