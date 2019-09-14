const service = new Service(7134361);
const formController = new FormController(document.forms[0]);
const outputController = new OutputController(document.getElementById('output-container'));

formController.on('submit', (inputs) => {
    outputController.bind(service.load(inputs));
});
