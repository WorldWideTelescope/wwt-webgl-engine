const utils = require('../utils');

import {
    NightwatchBrowser,
} from "nightwatch";

const researchApp: any = null;

const tests = {

    researchApp: researchApp, // eslint-disable @typescript-eslint/no-explicit-any

    before: function (browser: NightwatchBrowser): void {
        browser.globals.waitForConditionTimeout = 7500;
        this.researchApp = browser.page.researchApp();
    },

    // Navigate to the page
    // and wait for the app and WWT component to be visible
    'Navigation and loading': function () {
        this.researchApp
            .navigate()
            .waitForReady();
    },

    // Test the initial configuration of the research app
    // This consists of verifying that the appropriate elements
    // are displayed, and that any initial values are correct
    'Initial configuration': function () {
        const app = this.researchApp;
        const displayPanel = app.section.displayPanel;
        const controls = app.section.controls;

        app.expect.title().to.equal(app.props.title);
        utils.expectAllPresent(app, [
            "@displayPanel",
            "@controls",
            "@tools",
        ]);

        displayPanel.expect.element("@coordinateDisplay").to.be.present;
        displayPanel.expect.element("@coordinateDisplay").text.to.equal(displayPanel.props.initialCoordinateText);

        const controlItems = [
            "@toolChooser",
            "@zoomIn",
            "@zoomOut",
            "@fullScreen",
        ];
        utils.expectAllPresent(controls, controlItems);
        controls.expect.elements("@controlItem").count.to.equal(controlItems.length);
    },

    // Test the functionality of the background chooser
    'Background selection': function () {
        const app = this.researchApp;
        const controls = app.section.controls;
        const tools = app.section.tools;

        // Open the tool chooser
        // Verify that the popover and the two buttons display
        controls.click("@toolChooser");
        utils.expectAllPresent(app, [
            "@toolMenu",
            "@backgroundButton",
            "@catalogButton",
        ]);

        // Select the background chooser
        app.click("@backgroundButton");
        utils.expectAllPresent(tools, [
            "@backgroundSelectionContainer",
            "@backgroundSelectionTitle",
        ]);

        // Verify that the label and the initial choice are correct
        tools.expect.element("@backgroundSelectionTitle").text.to.equal("Background imagery:");
        tools.expect.element("@selectedBackgroundText").text.to.equal("DSS");

        // Open the list of options
        // Check that the count is correct
        tools.click("@backgroundSelectionToggle");
        app.expect.element("@toolMenu").to.not.be.present;
        tools.expect.element("@backgroundDropdown").to.be.present;
        tools.expect.elements("@backgroundDropdownOption").count.to.equal(tools.props.backgroundOptionCount);

        // Verify that the first catalog in the list has the correct name and description
        const [firstBackgroundOption, firstBackgroundName, firstBackgroundDescription] = [
            "@backgroundDropdownOption",
            "@backgroundDropdownOptionName",
            "@backgroundDropdownOptionDescription"
        ].map(selector => utils.nthOfTypeSelector(selector, 1));
        utils.expectAllPresent(tools, [firstBackgroundOption, firstBackgroundName, firstBackgroundDescription]);
        tools.expect.element(firstBackgroundName).text.to.equal(tools.props.firstBackgroundName);
        tools.expect.element(firstBackgroundDescription).text.to.equal(tools.props.firstBackgroundDescription);

    },

    'HiPS catalog selection': function () {
        const app = this.researchApp;
        const controls = app.section.controls;
        const tools = app.section.tools;
        const displayPanel = app.section.displayPanel;

        // Open the tool chooser
        // Verify that the popover and the two buttons display
        controls.click("@toolChooser");
        utils.expectAllPresent(app, [
            "@toolMenu",
            "@backgroundButton",
            "@catalogButton",
        ]);

        // Select the catalog chooser
        app.click("@catalogButton");
        utils.expectAllPresent(tools, [
            "@catalogSelectionContainer",
            "@catalogSelectionTitle",
        ]);
        tools.expect.element("@catalogSelectionTitle").text.to.equal("Add catalog:");

        // Open the list of options
        // Check that the count is correct
        tools.click("@catalogSelectionToggle");
        app.expect.element("@toolMenu").to.not.be.present;
        tools.expect.element("@catalogDropdown").to.be.present;
        tools.expect.elements("@catalogDropdownOption").count.to.equal(tools.props.catalogOptionCount);

        // Open the catalog list
        // Verify that the first option has the correct name
        // Then select it
        const [firstCatalogOption, firstCatalogName] = [
            "@catalogDropdownOption",
            "@catalogDropdownOptionName"
        ].map(selector => utils.nthOfTypeSelector(selector, 1));
        utils.expectAllPresent(tools, [firstCatalogOption, firstCatalogName]);
        tools.expect.element(firstCatalogName).text.to.equal(tools.props.firstCatalogName);
        tools.click(firstCatalogOption);

        // Check that the catalog displays in the panel
        // with the correct name
        const firstCatalogTitle = utils.nthOfTypeSelector("@catalogTitle", 1);
        const firstCatalogButtons: string[] = [
            utils.nthOfTypeSelector("@catalogVisibilityButton", 1),
            utils.nthOfTypeSelector("@catalogDeleteButton", 2),
        ];
        displayPanel.expect.elements("@catalogItem").count.to.equal(1);
        utils.expectAllPresent(displayPanel, firstCatalogButtons);
        displayPanel.expect.element(firstCatalogTitle).text.to.equal(tools.props.firstCatalogName);

        // To start, the visibility and delete button should not be visible
        utils.expectAllNotVisible(displayPanel, firstCatalogButtons);

        // If we click on catalog title, check that the UI container becomes
        // visible. The buttons should appear as well.
        //
        // The nth-of-type finds the element of the same type as the
        // @catalogItem, which is a <div>, and is 1-based. The first sibling
        // <div> is the section header, so the 2nd <div> is the first catalog
        // item.
        const firstCatalog: string = utils.nthOfTypeSelector("@catalogItem", 2);
        const toClick: string = firstCatalogTitle;
        const firstCatalogDetail = `${firstCatalog} ${displayPanel.props.detailClass}`;
        displayPanel.click(toClick);
        utils.expectAllVisible(displayPanel, firstCatalogButtons.concat([firstCatalogDetail]));

        // If we click it again, check that it goes away
        displayPanel.click(toClick);
        displayPanel.expect.element(firstCatalogDetail).to.not.be.present;

        // Check that the catalog goes away if we click the delete button
        displayPanel.click(firstCatalogButtons[1]);
        displayPanel.expect.elements("@catalogItem").count.to.equal(0);
    },

    after: function (browser: NightwatchBrowser) {
        browser.end();
    }
}

module.exports = tests;
