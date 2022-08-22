"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.WordService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var meaning_entity_1 = require("../meaning/meaning.entity");
var axios = require("axios");
var node_html_parser_1 = require("node-html-parser");
var fetch = require('node-fetch');
var fs = require('fs');
var PDFParser = require("pdf2json");
var WordService = /** @class */ (function () {
    function WordService(wordRepo) {
        this.wordRepo = wordRepo;
        this.counter = 0;
    }
    WordService.prototype.translateWord = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            var encodedParams, options, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        encodedParams = new URLSearchParams();
                        encodedParams.append("q", word);
                        encodedParams.append("target", "pl");
                        encodedParams.append("source", "en");
                        options = {
                            method: 'POST',
                            url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
                            headers: {
                                'content-type': 'application/x-www-form-urlencoded',
                                'Accept-Encoding': 'application/gzip',
                                'X-RapidAPI-Key': '9955f8dc65mshea2d9990a9ad31fp10acebjsn8052d4e2a1a6',
                                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
                            },
                            data: encodedParams
                        };
                        return [4 /*yield*/, axios.request(options)];
                    case 1:
                        result = _a.sent();
                        console.log('word.data: ', result.data);
                        return [2 /*return*/, result.data.data.translations[0].translatedText];
                }
            });
        });
    };
    WordService.prototype.processB1CambridgeVocabularyLine = function (line, prevLine) {
        var words = [];
        line.forEach(function (word) {
            //filters
            if (!(!word ||
                /[\(\)\%]/.test(word) || // if contains '(' , ')' or '%'
                word.length === 1 ||
                /^\d+$/.test(word) || // exclude digits
                word === 'B1')) {
                word = word.replace('.', '').toLowerCase();
                if (![
                    'as',
                    'by',
                    'ucles',
                    'of',
                    'page',
                    'b1',
                    'preliminary',
                    'and',
                    'for',
                    'schools',
                ].includes(word)) {
                    words.push(word);
                }
            }
        });
        return words;
    };
    WordService.prototype.processSamplePdfLine = function (line, prevLine) {
        var words = [];
        var lastWordInPrevLine = prevLine && prevLine[prevLine.length - 1];
        if ((lastWordInPrevLine === null || lastWordInPrevLine === void 0 ? void 0 : lastWordInPrevLine.slice(-1)) === '-') {
            line[0] = lastWordInPrevLine.slice(0, -1) + line[0];
        }
        var finalLine = [];
        line.forEach(function (word, idx) {
            word = word.replaceAll(/\%../ig, '');
            word = word.replaceAll('.', '');
            word = word.toLowerCase();
            if (!(idx === line.length - 1 || word.slice(-1) === '-')) { //if last word
                if (!word || word === '.' || word === ',' || /^\d+$/.test(word) || word.length === 1) {
                }
                else {
                    finalLine.push(word);
                    words.push(word);
                }
            }
        });
        return words;
    };
    WordService.prototype.extractWords = function (page, processLine) {
        var words = [];
        var prevLine;
        page.Texts.forEach(function (rawLine) {
            var line = rawLine.R[0].T.split('%20');
            var cleanedUpWords = processLine(line, prevLine);
            words.push.apply(words, cleanedUpWords);
            // console.log('--------');
            // console.log('prevLine: ', prevLine);
            // console.log('line: ', line);
            //console.log('final line: ', finalLine);
            // if(prevLine[prevLine.length-1].slice(-1) === '-') {
            //   console.log('word with new line:', prevLine[prevLine.length-1]);
            // }
            //console.log('words in line:');
            prevLine = line;
        });
        return words;
    };
    WordService.prototype.processPdfFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pdfParser;
            var _this = this;
            return __generator(this, function (_a) {
                pdfParser = new PDFParser();
                pdfParser.on("readable", function (meta) { return console.log("PDF Metadata", meta); });
                pdfParser.on("data", function (page) {
                    //console.log(page ? "One page paged" : "All pages parsed", page)
                    _this.counter++;
                    // if(this.counter > 20) {
                    //   return;
                    // }
                    console.log('====================== ', _this.counter);
                    //let words = this.extractWords(page, this.processSamplePdfLine);
                    var words = _this.extractWords(page, _this.processB1CambridgeVocabularyLine);
                    console.log('words: ', words);
                    words.forEach(function (word) { return __awaiter(_this, void 0, void 0, function () {
                        var wordEntity, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    wordEntity = this.wordRepo.create({
                                        lang_english: word,
                                        origin: 'b1-cambridge-list.pdf',
                                        level: 'B1',
                                        freq: 1
                                    });
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, this.wordRepo.save(wordEntity)];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _a.sent();
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                });
                pdfParser.on("error", function (err) { return console.error("Parser Error", err); });
                pdfParser.on("pdfParser_dataError", function (errData) { return console.error(errData.parserError); });
                pdfParser.on("pdfParser_dataReady", function (pdfData) {
                    fs.writeFile("./pdf2json/test/F1040EZ.fields.json", JSON.stringify(pdfParser.getAllFieldsTypes()), function () { console.log("Done."); });
                });
                //pdfParser.loadPDF("./pdfs/sample.pdf");
                pdfParser.loadPDF("./pdfs/b1-cambridge-list.pdf");
                return [2 /*return*/];
            });
        });
    };
    WordService.prototype.translateWords = function () {
        return __awaiter(this, void 0, void 0, function () {
            var words;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.wordRepo
                            .createQueryBuilder("user")
                            .getMany()];
                    case 1:
                        words = _a.sent();
                        words.forEach(function (word) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = word;
                                        return [4 /*yield*/, this.translateWord(word.lang_english)];
                                    case 1:
                                        _a.lang_polish = _b.sent();
                                        console.log('waord.lang.polish: ', word.lang_polish);
                                        return [4 /*yield*/, this.wordRepo.save(word)];
                                    case 2:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    // async test() {
    //   let result = await this.wordRepo
    //     .createQueryBuilder()
    //     .select('COUNT(*) as count')
    //     .getRawOne();
    //   let count = Number.parseInt(result.count);
    //
    //   let counter = 10;
    //   let randomizedWordIds = [];
    //   while(counter--) {
    //     let randomInt;
    //     let ordered = await this.wordRepo
    //       .createQueryBuilder()
    //       .orderBy('lang_english', 'ASC')
    //       .limit(1)
    //       .offset(randomInt)
    //       .getOne();
    //
    //     randomizedWordIds.push(ordered.id);
    //     console.log(ordered);
    //   }
    //
    // }
    WordService.prototype.testDiki = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                fetch('https://www.diki.pl/slownik-angielskiego?q=ograniczony')
                    .then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                    var html, root, dictionaryEntity, titleNode, title, partOfSpeechNode;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, result.text()];
                            case 1:
                                html = _a.sent();
                                root = (0, node_html_parser_1.parse)(html);
                                dictionaryEntity = root.querySelector('.dictionaryEntity');
                                titleNode = root.querySelector('.dictionaryEntity .hws .hw');
                                title = titleNode.childNodes[0].rawText;
                                console.log('title: ', title);
                                partOfSpeechNode = root.querySelector('.dictionaryEntity');
                                //console.log('node: ', partOfSpeechNode);
                                partOfSpeechNode.childNodes.map(function (el) {
                                    var _a;
                                    var parsed = (0, node_html_parser_1.parse)(el.toString());
                                    if (parsed) {
                                        var el_1 = (_a = parsed.querySelector('.partOfSpeechSectionHeader .partOfSpeech')) === null || _a === void 0 ? void 0 : _a.rawText;
                                        if (el_1) {
                                            console.log('el: ', el_1);
                                        }
                                        var list = parsed.querySelector('.nativeToForeignEntrySlices');
                                        if (list) {
                                            var filteredList = list === null || list === void 0 ? void 0 : list.childNodes.map(function (el) { return el.rawText; });
                                            filteredList = filteredList.map(function (el) { return el.replaceAll(/\n +/ig, ''); });
                                            filteredList = filteredList.filter(function (el) { return !!el; });
                                            filteredList = filteredList.map(function (el) {
                                                var regexpMatch = /^(\w+) .*/;
                                                var match = el.match(regexpMatch);
                                                return match ? match[1] : '';
                                            });
                                            console.log('list: ', filteredList);
                                        }
                                    }
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    WordService.prototype.onModuleInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('on module init');
                return [2 /*return*/];
            });
        });
    };
    WordService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(meaning_entity_1.MeaningEntity))
    ], WordService);
    return WordService;
}());
exports.WordService = WordService;
