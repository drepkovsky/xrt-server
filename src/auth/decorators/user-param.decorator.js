"use strict";
exports.__esModule = true;
exports.UserParam = void 0;
var common_1 = require("@nestjs/common");
exports.UserParam = (0, common_1.createParamDecorator)(function (data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    return request.user;
});
