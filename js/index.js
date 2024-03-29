const API_ID = 7135534;  // TODO присвоить актуальный ключ приложения
const service = new Service();
const formController = new FormController();
const outputController = new OutputController();

// inits app
function start() {
    formController.init(document.vkSearchForm);
    outputController.init(document.getElementById('outputs-container'));
    outputController.bind(service);
    formController.on('submit', (inputs) => {
        service.load(inputs, 1000, 48);
    });
}

// document ready promise
const documentReady = new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', function(){
        resolve(true);
    });
});

// vk ready promise
const vkReady = new Promise(resolve => {
    //lazy vk init as described at https://vk.com/dev/openapi?f=2.1.%20%D0%9E%D0%B1%D1%8B%D1%87%D0%BD%D0%B0%D1%8F%20%D0%B8%D0%BD%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F
    window.vkAsyncInit = function() {
        VK.init({
            apiId: API_ID
        });
        resolve(VK);
    };
});

// init app on page & vk ready
Promise.all([ documentReady, vkReady ]).then(start);
