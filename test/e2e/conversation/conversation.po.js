module.exports = () => {

    const SELECTOR = {
        column: '#conversation-list-columns',
        row: '#conversation-list-rows',
        conversation: '.conversation',
        labels: '.labelsElement-label',
        checkbox: '.ptSelectConversation-input',
        placeholder: {
            container: '#pm_placeholder',
            title: '.numberElementSelected-title',
            btnUnselect: '.conversationPlaceholder-btn-unselect'
        }
    };

    const selectorConversations = ($main) => (index) => {
        const scope = typeof index === 'undefined' ? '' : `.eq(${index})`;
        return `$(document.body.querySelector('${$main}')).find('${SELECTOR.conversation}')${scope}`.trim();
    };

    function labels(scope) {
        const count = (...names) => {
            const $titles = names.map((n) => `${SELECTOR.labels}[title="${n}"]`).join(`, `);
            return browser.executeScript(`
                return ${scope()}
                    .find('${$titles}')
                    .length;
            `);
        };

        const getByConversation = (index = 0) => {
            return browser.executeScript(`
                return ${scope(index)}
                    .find('${SELECTOR.labels}')
                    .map(function() {
                        return this.title;
                    });
            `);
        };

        return { count, getByConversation };
    }


    function placeholder() {

        const $container = `$(document.body.querySelector('${SELECTOR.placeholder.container}'))`;

        const isVisible = () => {
            return browser.executeScript(`
                return ${$container}
                    .is(':visible');
            `);
        };

        const countSeleted = () => {
            return browser.executeScript(`
                const $title = ${$container}
                    .find('${SELECTOR.placeholder.title}')
                    .text();
                return +$title.match(/[0-9]./)[0];
            `);
        };

        const unselect = () => {
            return browser.executeScript(`
                return ${$container}
                    .find('${SELECTOR.placeholder.btnUnselect}')
                    .click();
            `);
        };

        return { isVisible, countSeleted, unselect };
    }

    function load({ column = true } = {}) {

        const scope = selectorConversations(SELECTOR[column ? 'column' : 'row']);

        const select = (index = 0) => {
            return browser.executeScript(`
                const $checkbox = ${scope(index)}
                    .find('${SELECTOR.checkbox}');

                $checkbox.click();
                return $checkbox[0].checked;
            `);
        };

        const count = () => {
            return browser.executeScript(`
                return ${scope()}.length;
            `);
        };

        const countSeleted = () => {
            return browser.executeScript(`
                return ${scope()}
                    .find('${SELECTOR.checkbox}')
                    .filter(':checked')
                    .length;
            `);
        };


        return {
            count, select, countSeleted,
            labels: labels(scope),
            placeholder: placeholder()
        };
    }

    return { load };

};
