var ICar = /** @class */ (function () {
    function ICar() {
        this.engine = '';
        this.gears = 0;
    }
    ICar.prototype.getEngine = function () {
        return this.engine;
    };
    ICar.prototype.getGears = function () {
        return this.gears;
    };
    ICar.prototype.setEngine = function (str) {
        this.engine = str;
    };
    ICar.prototype.setGears = function (gears) {
        this.gears = gears;
    };
    return ICar;
}());
