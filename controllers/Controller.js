const Response = require('../response');
const utilities = require('../utilities');
const TokenManager = require('../tokenManager');
/////////////////////////////////////////////////////////////////////
// Important note about controllers:
// You must respect pluralize convention: 
// For ressource name RessourName you have to name the controller
// RessourceNamesController that must inherit from Controller class
// in order to have proper routing from request to controller action
/////////////////////////////////////////////////////////////////////
module.exports =
    class Controller {
        constructor(req, res, params, needAuthorization = false) {
            if (req != null && res != null) {
                this.req = req;
                this.res = res;
                this.response = new Response(res, this.req.url);
                this.params = params;
                // if true, will require a valid bearer token from request header
                this.needAuthorization = needAuthorization;
            }
        }
        requestAuthorized() {
            if (this.needAuthorization) {
                return TokenManager.requestAuthorized(this.req);
            }
            return true;
        }
        requestActionAuthorized() {
            return TokenManager.requestAuthorized(this.req);
        }
        paramsError(params, message) {
            if (params) {
                params["error"] = message;
                this.response.JSON(params);
            } else {
                this.response.JSON(message);
            }
            return false;
        }
        head() {
            this.response.notImplemented();
        }
        getAll() {
            this.response.notImplemented();
        }
        get(id) {
            this.response.notImplemented();
        }
        post(obj) {
            this.response.notImplemented();
        }
        put(obj) {
            this.response.notImplemented();
        }
        patch(obj) {
            this.response.notImplemented();
        }
        remove(id) {
            this.response.notImplemented();
        }
    }