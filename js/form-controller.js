/**
 * controls form
 */
class FormController extends EventEmitter {
    /**
     * @param {HTMLElement} form
     */
    constructor (form) {
        super(['submit']);
        this.isValid = true;

        this.init(form);
    }

    /**
     * initialize controller
     * subscribes events
     * @param form
     */
    init (form) {
        this._form = form;
        this._form.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                this.submit();
            } catch (e) {
                throw new Error(e.message);
            }
            return false;

        });
    }

    /**
     * validates form data
     */
    validate () {

    }


    submit () {
        this.validate();
        if (this.isValid) {
            this.fire('submit', this.inputs());
        }
        return this.isValid;
    }

    /**
     * validates form
     * @param elt
     * @param evt
     */
    inputs () {
        let ok = false;
        let inputs = {

        };
        if (ok) {
            return inputs;
        } else {
            return false;
        }
    }

    /**
     * handler for input change
     * validates inputs
     * @param elt
     * @param evt
     */
    validateOnInput (elt, evt) {

    }
}
