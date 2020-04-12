context('Actions', () => {
    before(() => {
        const allure = Cypress.Allure.reporter.getInterface();
        const today = new Date();
        const currentHour = today.getHours();
        allure.writeExecutorInfo({
            name: 'somename',
            type: 'type', // jenkins, bamboo, teamcity
            url: 'https://google.com.ua',
            buildOrder: currentHour, // in case buildOrder are same - it will count as retry
            buildName: 'basic',
            buildUrl: 'https://path-to-ci',
            reportUrl: 'https://path-to-report',
            reportName: 'reportName'
        });

        allure.writeEnvironmentInfo({
            someEnvInfo: 'envInfo'
        });

        allure.writeCategoriesDefinitions([
            {
                name: 'Not to have class tests',
                messageRegex: /.*not to have class.*/,
                matchedStatuses: ['failed']
            }
        ]);
    });

    beforeEach(() => {
        cy.visit('https://example.cypress.io/commands/actions');
        const allure = Cypress.Allure.reporter.getInterface();
        allure.feature('Actions Feature');
        allure.epic('Plain js tests');
        allure.tms('docs', 'https://on.cypress.io/interacting-with-elements');
        allure.label('tag', 'this is tag');
        allure.label('owner', 'Me, lol');
    });

    afterEach(() => {
        cy.log(`this is after each hook`);
    });

    it('.focus() - focus on a DOM element', () => {
        cy.allure()
            .tms('docs', 'https://on.cypress.io/focus')
            .severity('minor');
        cy.get('.action-focus')
            .focus()
            .should('not.have.class', 'focus')
            .prev()
            .should('have.attr', 'style', 'color: orange;');
    });

    it('.blur() - blur off a DOM element', () => {
        cy.allure().tms('docs', 'https://on.cypress.io/blur');
        cy.get('.action-blur')
            .type('About to blur')
            .blur()
            .should('have.class', 'error')
            .prev()
            .should('have.attr', 'style', 'color: red;');
    });

    it('.clear() - clears an input or textarea element', () => {
        cy.allure().tms('docs', 'https://on.cypress.io/clear');
        cy.get('.action-clear')
            .type('Clear this text')
            .should('have.value', 'Clear this text')
            .clear()
            .should('have.value', '');
    });

    it('.submit() - submit a form', () => {
        cy.allure().tms('docs', 'https://on.cypress.io/submit');
        cy.get('.action-form').find('[type="text"]').type('HALFOFF');
        cy.get('.action-form')
            .submit()
            .next()
            .should('contain', 'Your form has been submitted!');
    });

    it('.click() - click on a DOM element', () => {
        cy.allure()
            .tms('docs', 'https://on.cypress.io/click')
            .descriptionHtml(
                `
        <p class="has-line-data" data-line-start="0" data-line-end="1">You can click on 9 specific positions of an element:</p>
        <pre><code>
        -------------------------------------
        | topLeft        top       topRight |
        |                                   |  
        |                                   |  
        |                                   |  
        | left          center        right |  
        |                                   |  
        |                                   |  
        |                                   |  
        | bottomLeft   bottom   bottomRight |  
        -------------------------------------
        </code></pre>`
            )
            .severity('critical');
        cy.get('.action-btn').click();

        // clicking in the center of the element is the default
        cy.get('#action-canvas').click();

        cy.get('#action-canvas').click('topLeft');
        cy.get('#action-canvas').click('top');
        cy.get('#action-canvas').click('topRight');
        cy.get('#action-canvas').click('left');
        cy.get('#action-canvas').click('right');
        cy.get('#action-canvas').click('bottomLeft');
        cy.get('#action-canvas').click('bottom');
        cy.get('#action-canvas').click('bottomRight');

        // .click() accepts an x and y coordinate
        // that controls where the click occurs :)

        cy.get('#action-canvas')
            .click(80, 75) // click 80px on x coord and 75px on y coord
            .click(170, 75)
            .click(80, 165)
            .click(100, 185)
            .click(125, 190)
            .click(150, 185)
            .click(170, 165);

        // click multiple elements by passing multiple: true
        cy.get('.action-labels>.label').click({ multiple: true });

        // Ignore error checking prior to clicking
        cy.get('.action-opacity>.btn').click({ force: true });
    });

    it('.dblclick() - double click on a DOM element', () => {
        cy.allure()
            .tms('docs', 'https://on.cypress.io/dblclick')
            .description(
                `
      Our app has a listener on 'dblclick' event in our 'scripts.js'
      that hides the div and shows an input on double click`
            )
            .severity('blocker');

        cy.get('.action-div').dblclick().should('not.be.visible');
        cy.get('.action-input-hidden').should('be.visible');
    });

    it('.rightclick() - right click on a DOM element', () => {
        cy.allure()
            .tms('docs', 'https://on.cypress.io/rightclick')
            .description(
                `
      Our app has a listener on 'contextmenu' event in our 'scripts.js'
      that hides the div and shows an input on right click`
            )
            .severity('blocker');
        cy.get('.rightclick-action-div').rightclick().should('not.be.visible');
        cy.get('.rightclick-action-input-hidden').should('be.visible');
        cy.allure().label('subSuite', 'subSuiteValue');
    });

    it('.check() - check a checkbox or radio element', () => {
        cy.allure().tms('docs', 'https://on.cypress.io/check').description(`
      By default, .check() will check all
      matching checkbox or radio elements in succession, one after another`);

        cy.get('.action-checkboxes [type="checkbox"]')
            .not('[disabled]')
            .check()
            .should('be.checked');

        cy.get('.action-radios [type="radio"]')
            .not('[disabled]')
            .check()
            .should('be.checked');

        cy.allure().step('.check() accepts a value argument');

        cy.get('.action-radios [type="radio"]')
            .check('radio1')
            .should('be.checked');

        cy.allure().step('.check() accepts an array of values');
        cy.get('.action-multiple-checkboxes [type="checkbox"]')
            .check(['checkbox1', 'checkbox2'])
            .should('be.checked');

        cy.allure().step('Ignore error checking prior to checking');
        cy.get('.action-checkboxes [disabled]')
            .check({ force: true })
            .should('be.checked');

        cy.get('.action-radios [type="radio"]')
            .check('radio3', { force: true })
            .should('be.checked');
    });

    it('.type() - type into a DOM element', () => {
        cy.allure()
            .tag('FAILED BY INTENT')
            .tms('docs', 'https://on.cypress.io/type')
            .step('take usual screenshot from test');
        cy.screenshot();

        cy.get('.action-email')
            .type('fake@email.com')
            .should('have.value', 'fakes@email.com');

        cy.allure()
            .step('.type() with special character sequences')
            .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
            .type('{del}{selectall}{backspace}');

        cy.allure()
            .step('.type() with key modifiers')
            .type('{alt}{option}') //these are equivalent
            .type('{ctrl}{control}') //these are equivalent
            .type('{meta}{command}{cmd}') //these are equivalent
            .type('{shift}');

        cy.allure()
            .step('Delay each keypress by 0.1 sec')
            .type('slow.typing@email.com', { delay: 100 })
            .should('have.value', 'slow.typing@email.com');

        cy.allure().step(
            'Ignore error checking prior to type, like whether the input is visible or disabled'
        );
        cy.get('.action-disabled')
            .type('disabled error checking', { force: true })
            .should('have.value', 'disabled error checking');
    });

    it('.uncheck() - uncheck a checkbox element', () => {
        cy.allure()
            .tms('docs', 'https://on.cypress.io/uncheck')
            .step(
                'By default, .uncheck() will uncheck all matching checkbox elements in succession, one after another'
            );
        cy.get('.action-check [type="checkbox"]')
            .not('[disabled]')
            .uncheck()
            .should('not.be.checked');
        cy.screenshot();
        cy.allure().step('.uncheck() accepts a value argument');
        cy.get('.action-check [type="checkbox"]')
            .check('checkbox1')
            .uncheck('checkbox1')
            .should('not.be.checked');

        cy.allure().step('.uncheck() accepts an array of values');
        cy.get('.action-check [type="checkbox"]')
            .check(['checkbox1', 'checkbox3'])
            .uncheck(['checkbox1', 'checkbox3'])
            .should('not.be.checked');

        cy.allure().step('Ignore error checking prior to unchecking');
        cy.get('.action-check [disabled]')
            .uncheck({ force: true })
            .should('not.be.checked');
    });

    it('.select() - select an option in a <select> element', () => {
        cy.allure().tms('docs', 'https://on.cypress.io/select');

        // at first, no option should be selected
        cy.get('.action-select').should('have.value', '--Select a fruit--');

        // Select option(s) with matching text content
        cy.get('.action-select').select('apples');
        // confirm the apples were selected
        // note that each value starts with "fr-" in our HTML
        cy.get('.action-select').should('have.value', 'fr-apples');
        cy.allure().testAttachment(
            'csv_table',
            `John,Doe,120 jefferson st.,Riverside, NJ, 08075
        Jack,McGinnis,220 hobo Av.,Phila, PA,09119
        "John ""Da Man""",Repici,120 Jefferson St.,Riverside, NJ,08075
        Stephen,Tyler,"7452 Terrace ""At the Plaza"" road",SomeTown,SD, 91234
        ,Blankman,,SomeTown, SD, 00298
        "Joan ""the bone"", Anne",Jet,"9th, at Terrace plc",Desert City,CO,00123`,
            'text/csv'
        );
        cy.get('.action-select-multiple')
            .select(['apples', 'oranges', 'bananas'])
            // when getting multiple values, invoke "val" method first
            .invoke('val')
            .should('deep.equal', ['fr-apples', 'fr-oranges', 'fr-bananas']);

        // Select option(s) with matching value
        cy.get('.action-select')
            .select('fr-bananas')
            // can attach an assertion right away to the element
            .should('have.value', 'fr-bananas');

        cy.get('.action-select-multiple')
            .select(['fr-apples', 'fr-oranges', 'fr-bananas'])
            .invoke('val')
            .should('deep.equal', ['fr-apples', 'fr-oranges', 'fr-bananas']);
        // assert the selected values include oranges
        cy.get('.action-select-multiple')
            .invoke('val')
            .should('include', 'fr-oranges');
    });

    it('.scrollIntoView() - scroll an element into view', () => {
        cy.allure().parameter('docs', 'https://on.cypress.io/scrollintoview');

        // normally all of these buttons are hidden,
        // because they're not within
        // the viewable area of their parent
        // (we need to scroll to see them)
        cy.get('#scroll-horizontal button').should('not.be.visible');

        // scroll the button into view, as if the user had scrolled
        cy.get('#scroll-horizontal button')
            .scrollIntoView()
            .should('be.visible');

        cy.get('#scroll-vertical button').should('not.be.visible');

        // Cypress handles the scroll direction needed
        cy.get('#scroll-vertical button').scrollIntoView().should('be.visible');

        cy.get('#scroll-both button').should('not.be.visible');

        // Cypress knows to scroll to the right and down
        cy.get('#scroll-both button').scrollIntoView().should('be.visible');
    });

    it('.trigger() - trigger an event on a DOM element', () => {
        cy.allure().parameter('docs', 'https://on.cypress.io/trigger');

        // To interact with a range input (slider)
        // we need to set its value & trigger the
        // event to signal it changed

        // Here, we invoke jQuery's val() method to set
        // the value and trigger the 'change' event
        cy.get('.trigger-input-range')
            .invoke('val', 25)
            .trigger('change')
            .get('input[type=range]')
            .siblings('p')
            .should('have.text', '25');
    });

    it('cy.scrollTo() - scroll the window or element to a position', () => {
        cy.allure()
            .tms('docs', 'https://on.cypress.io/scrollTo')
            .descriptionHtml(
                `
        <p class="has-line-data" data-line-start="0" data-line-end="1">You can click on 9 specific positions of an element:</p>
        <pre><code>
        -------------------------------------
        | topLeft        top       topRight |
        |                                   |  
        |                                   |  
        |                                   |  
        | left          center        right |  
        |                                   |  
        |                                   |  
        |                                   |  
        | bottomLeft   bottom   bottomRight |  
        -------------------------------------
        </code></pre>`
            );

        // if you chain .scrollTo() off of cy, we will
        // scroll the entire window
        cy.scrollTo('bottom');

        cy.get('#scrollable-horizontal').scrollTo('right');

        // or you can scroll to a specific coordinate:
        // (x axis, y axis) in pixels
        cy.allure().parameter('x', 250).parameter('y', 250);
        cy.get('#scrollable-vertical').scrollTo(250, 250);

        // or you can scroll to a specific percentage
        // of the (width, height) of the element
        cy.allure()
            .parameter('scrollWidth', 250)
            .parameter('scrollHeight', 250);
        cy.get('#scrollable-both').scrollTo('75%', '25%');

        // control the easing of the scroll (default is 'swing')
        cy.get('#scrollable-vertical').scrollTo('center', { easing: 'linear' });

        // control the duration of the scroll (in ms)
        cy.get('#scrollable-both').scrollTo('center', { duration: 2000 });
    });
});
