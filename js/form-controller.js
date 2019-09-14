/**
 * controls form
 */
class FormController extends EventEmitter {
    constructor () {
        super(['submit']);
        this.isValid = true;
        this._form = null;
        this._inputs = {
            day: null,
            month: null,
            year: null
        }
    }

    /**
     * initialize controller
     * subscribes events
     * @param {HTMLElement} form
     */
    init (form) {
        this._form = form;
        this._form.addEventListener('submit', (e) => {
            e.preventDefault();

            this.submit();

            return false;

        });
    }

    /**
     * validates form data
     */
    validate () {
        // day
        this._inputs.day = this._form.day.value;
        // month
        this._inputs.month = this._form.month.value;
        // year
        this._inputs.year = this._form.year.value;

        return true;
    }


    submit () {
        this.validate();
        if (this.isValid) {
            this.fire('submit', [this.inputs()]);
        }
        return this.isValid;
    }

    /**
     * validates form
     * @param elt
     * @param evt
     */
    inputs () {

        return this._inputs;
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
