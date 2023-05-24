import { test, defineConfig, Browser, BrowserContext, chromium } from '@playwright/test';
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
const Email = 'xxxxx'
const Password = 'xxxxxx'


test.describe('Playwright web page accessibility test', async () => {
    test.beforeEach(async () => {
        // @ts-ignore
        // browser = await chromium.launch(defineConfig)
        browser = await chromium.launch({
            headless: false,
        })
        context = await browser.newContext()
        page = await context.newPage();
        await page.goto(URL)
        await injectAxe(page)
    })

    test(`Settings > Skills & Experience`, async () => {


        const EmailFild = await page.locator('#user_email');
        const PasswordFild = await page.locator('#user_password');
        const SignInButton = await page.locator("input[value='Sign In']");
        await EmailFild.fill(Email);
        await PasswordFild.fill(Password);
        await SignInButton.click();

        let url = await page.url()
        expect(url).to.equal('https://tester.test.io/')

        const logo = await page.locator("img[title='test IO']")
        await logo.click();

        const settings = await page.locator("a[class='testio-nav-item hidden-xs-down pb-0'] span[class='icon icon-cog mr-0']")
        await settings.click();

        url = await page.url()
        expect(url).to.equal('https://tester.test.io/account/profile')

        const skillsExperience = await page.locator("a[href='/account/skills']")
        await skillsExperience.click();


        url = await page.url()
        expect(url).to.equal('https://tester.test.io/account/skills')


















        const reportRes = await new AxeBuilder({ page })
            .withTags([
                'wcag2a',
                'wcag2aa',
                'wcag2aaa',
                'wcag21aa',
                'wcag21a',
                'wcag22aa'])
            .withRules(['html-lang', 'image-alt', 'aria-allowed-attr', 'tab-index', 'area-alt', 'aria-allowed-attr', 'aria-command-name', 'aria-hidden-body', 'aria-hidden-focus', 'aria-input-field-name', 'aria-meter-name', 'aria-progressbar-name', 'aria-required-attr', 'aria-required-children', 'aria-required-parent', 'aria-roledescription', 'aria-roles', 'aria-toggle-field-name', 'aria-tooltip-name', 'aria-valid-attr-value', 'aria-valid-attr', 'audio-caption', 'blink', 'button-name', 'bypass', 'color-contrast', 'definition-list', 'dlitem', 'document-title', 'duplicate-id-active', 'duplicate-id-aria', 'duplicate-id', 'form-field-multiple-labels', 'frame-focusable-content', 'frame-title-unique', 'frame-title', 'html-has-lang', 'html-lang-valid', 'html-xml-lang-mismatch', 'image-alt', 'input-button-name', 'input-image-alt', 'label', 'link-in-text-block', 'link-name', 'list', 'listitem', 'marquee', 'meta-refresh', 'meta-viewport', 'nested-interactive', 'no-autoplay-audio', 'object-alt', 'role-img-alt', 'scrollable-region-focusable', 'select-name', 'server-side-image-map', 'svg-img-alt', 'td-headers-attr', 'th-has-data-cells', 'valid-lang', 'video-caption', 'autocomplete-valid', 'avoid-inline-spacing', 'target-size'])
            .exclude('#top-nav-bar')
            .exclude('#main-sidebar')
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
        console.log('')
    })








    test.afterEach(async () => {
        await browser.close()
    })
})
