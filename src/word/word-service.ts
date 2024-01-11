import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, MoreThan, Repository } from "typeorm";
import { LangType, MeaningEntity } from "../meaning/meaning.entity";
import { parse } from "node-html-parser";
import { WordEntity } from "./word.entity";
import WordParticle from "./word-particle.entity";
import { LinkEntity } from "../meaning/link.entity";

const axios = require("axios");

const fetch = require("node-fetch");

const fs = require("fs");
const PDFParser = require("pdf2json");

var nrand = require("gauss-random");


@Injectable()
export class WordService implements OnModuleInit {
  constructor(
    @InjectRepository(WordEntity)
    private wordRepo: Repository<WordEntity>,
    @InjectRepository(WordParticle)
    private wordParticleRepo: Repository<WordParticle>,
    @InjectRepository(MeaningEntity)
    private meaningRepo: Repository<MeaningEntity>,
    @InjectRepository(LinkEntity)
    private linkRepo: Repository<LinkEntity>
  ) {
  }

  public async searchByText(search: string): Promise<WordEntity[]> {
    const result: WordEntity[] = await this.wordRepo
        .createQueryBuilder("word")
        .select()
        .addSelect('CHAR_LENGTH(word.word)', 'wordLength')
        .innerJoinAndSelect("word.wordParticles", "wordParticles")
        .where("wordParticles.wordParticle LIKE :search", {
          search: search + "%"
        })
        .orWhere("word.word LIKE :search", {
          search: search + "%"
        })
        .take(40)
        .orderBy("wordLength", "ASC")
        .getMany();
    const query: string = this.wordRepo
        .createQueryBuilder("word")
        .select()
        .addSelect('CHAR_LENGTH(word.word)', 'wordLength')
        .innerJoinAndSelect("word.wordParticles", "wordParticles")
        .where("wordParticles.wordParticle LIKE :search", {
          search: search + "%"
        })
        .orWhere("word.word LIKE :search", {
          search: search + "%"
        })
        .take(40)
        .orderBy("wordLength", "ASC")
        .getQuery();
    console.log('query: ', query);
    return result;
  }

  public async wordExists(word: string, lang: string): Promise<WordEntity> {
    console.log("wordExists: ", word, lang);
    let wordEntity = await this.wordRepo
      .createQueryBuilder()
      .where({
        word,
        lang
      })
      .getOne();
    console.log("word text: ", word);
    console.log("word: ", wordEntity);
    return wordEntity;
  }

  public async deleteWordIfOrphan(wordId: number): Promise<boolean> {
    let result = await this.wordRepo.manager.query(
      `SELECT * FROM meaning_word_jointable WHERE wordId = ?`,
      [wordId]
    );
    console.log("result: ", result);
    if (result.length === 0) {
      console.log("word with id " + wordId + " is orphan, deleting...");
      await this.wordRepo.delete({
        id: wordId
      });
    } else {
      console.log("word with id " + wordId + " is NOT orphan, skipping...");
    }
    return true;
  }

  private async translateWord(word: string): Promise<string> {

    const encodedParams = new URLSearchParams();
    encodedParams.append("q", word);
    encodedParams.append("target", "pl");
    encodedParams.append("source", "en");

    const options = {
      method: "POST",
      url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "application/gzip",
        "X-RapidAPI-Key": "9955f8dc65mshea2d9990a9ad31fp10acebjsn8052d4e2a1a6",
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com"
      },
      data: encodedParams
    };

    try {
      let result = await axios.request(options);
      console.log("word.data: ", result.data.data.translations);
      return result.data.data.translations[0].translatedText;
    } catch (e) {
      console.log("rapid-api error: ", e);
    }
  }

  async findAllByMeaningId(meaningId: number, lang: LangType): Promise<LinkEntity[]> {
    let result = await
      this.meaningRepo
        .createQueryBuilder("meaning")
        .select()
        .innerJoinAndSelect("meaning.words", "links")
        .innerJoin("links.word", "word", "word.lang = :lang", {
          lang
        })
        .where({
          id: meaningId
        })
        .getOne();
    if (!result) {
      return [];
    }
    return result.words;
  }

  processB1CambridgeVocabularyLine(line: string[], prevLine: string[]) {
    let words = [];
    console.log("LINE: ", line);
    line.forEach(word => {
      //filters
      if (!(
        !word ||
        /[\(\)\%]/.test(word) || // if contains '(' , ')' or '%'
        word.length === 1 ||
        /^\d+$/.test(word) || // exclude digits
        word === "B1"
      )) {
        word = word.replace(".", "").toLowerCase();
        if (![
          "as",
          "by",
          "ucles",
          "of",
          "page",
          "b1",
          "preliminary",
          "and",
          "for",
          "schools"
        ].includes(word)) {
          words.push(word);
        }
      }
    });
    return words;
  }

  processSamplePdfLine(line: string[], prevLine: string[]) {
    let words = [];
    let lastWordInPrevLine = prevLine && prevLine[prevLine.length - 1];
    if (lastWordInPrevLine?.slice(-1) === "-") {
      line[0] = lastWordInPrevLine.slice(0, -1) + line[0];
    }
    let finalLine = [];
    line.forEach((word: any, idx) => {
      word = word.replaceAll(/\%../ig, "");
      word = word.replaceAll(".", "");
      word = word.toLowerCase();
      if (!(idx === line.length - 1 || word.slice(-1) === "-")) { //if last word
        if (!word || word === "." || word === "," || /^\d+$/.test(word) || word.length === 1) {

        } else {
          finalLine.push(word);
          words.push(word);
        }
      }
    });
    return words;
  }

  extractWords(page): { word: string, partOfSpeechRaw: string }[] {
    let words = [];
    let prevTxt;
    page.Texts.forEach(rawLine_ => {
      let rawLine = rawLine_.R[0].T;
      let line: string = rawLine.split("%20");
      const txt = rawLine.R[0].T;
      //console.log("rawLine: ", txt);
      //console.log("=======");
      // if (line[1]?.startsWith("%2F")) {
      //   console.log("prevline: ", prevLine);
      //   words.push({
      //     word: prevLine.join(" ")
      //   });
      // }
      //console.log("prevLine: ", prevLine);
      if (/\((.*)\)/.test(txt)) {
        try {
          let regexp = new RegExp(/\((.*)\)/);
          let partOfSpeech = regexp.exec(txt)[1];
          let word = prevTxt.split("%")[0];
          if (/[()]/.test(word)) {
            return;
          }
          if (word.length === 1) {
            return;
          }
          // console.log("word: ", word);
          // console.log("partOfSpeech: ", partOfSpeech);
          // console.log("=================");
          words.push({
            word: word,
            partOfSpeech: partOfSpeech
          });
        } catch (e) {
          console.log("ERR: ", e);
        }
      }
      prevTxt = txt;
    });
    return words;
  }

  extractWordsForMacedonianPdf(page): { word: string, partOfSpeechRaw: string }[] {
    let words = [];
    let prevRawLine;
    let wordFound = false;
    let foundWord = null;
    page.Texts.forEach(rawLine_ => {
      let rawLine = rawLine_.R[0].T;
      let line: string = rawLine.split("%20");
      //console.log("rawLine: ", rawLine);
      //console.log("rawLine: ", txt);
      //console.log("=======");
      // if (line[1]?.startsWith("%2F")) {
      //   console.log("prevline: ", prevLine);
      //   words.push({
      //     word: prevLine.join(" ")
      //   });
      // }
      // console.log("line: ", rawLine);
      // console.log("test: ", /^%20%2F/.test(rawLine));
      // console.log("wordFound: ", wordFound);
      if (/^%20%2F/.test(rawLine) && !wordFound) {
        //console.log("word: ", prevRawLine);
        //wordObj.word = prevRawLine;
        wordFound = true;
        foundWord = prevRawLine;
        return;
      }
      if (wordFound) {
        //console.log("word found: ", rawLine);
        if (/^[A-Z]+$/.test(rawLine)) {
          //console.log("partOfSpeech: ", rawLine);
          foundWord = foundWord.replaceAll("%20", " ");
          if (
            !/%/.test(foundWord) &&
            !!foundWord &&
            !/[)(]/.test(foundWord)
          ) {
            words.push({
              word: foundWord,
              partOfSpeechRaw: rawLine
            });
            wordFound = false;
          }
        }
      }
      prevRawLine = rawLine;
    });
    return words;
  }

  counter = 0;

  sem = require("semaphore")(2);
  semOuter = require("semaphore")(2);

  async processPdfFile() {
    const pdfParser = new PDFParser();
    pdfParser.on("readable", meta => console.log("PDF Metadata", meta));
    pdfParser.on("data", async page => {
      // console.log(page ? "One page paged" : "All pages parsed", page)


      if (page == null) {
        return;
      }
      console.log("====================== ", this.counter);
      //let words = this.extractWords(page, this.processSamplePdfLine);
      /**
       "verb",
       "noun",
       "adjective",
       "adverb",
       "preposition"
       */
      const partsOfSpeechMap = {
        "v": "verb",
        "n": "noun",
        "adj": "adjective",
        "adv": "adverb",
        "prep": "preposition",
        "pron": "pronoun"
      };

      let words = [];
      console.log("page number " + this.counter);
      words = this.extractWords(page);
      this.counter++;
      // if (this.counter > 2) {
      //   return;
      // }
      for (let wordObj of words) {
        await new Promise<void>((resolve) => {
          this.sem.take(1, function() {
            resolve();
          });
        });
        console.log("wordObj: ", wordObj);
        let word = wordObj.word;

        let partOfSpeechRaw = wordObj.partOfSpeechRaw;

        function removeDotAtTheEnd(word: string) {
          return word.replaceAll(".", "");
        }

        // word = removeDotAtTheEnd(word);
        let existingWord = await this.wordRepo
          .createQueryBuilder("word")
          .select()
          .innerJoinAndSelect("word.meanings", "links")
          .innerJoinAndSelect("links.meaning", "meaning")
          .innerJoinAndSelect("meaning.words", "words")
          .where("word.word = :word", {
            word
          })
          .getOne();

        if (existingWord) {
          console.log("word: ", word, " already exist, skipping...");
          continue;
        } else {
          console.log("new word: ", word);
        }

        // if (this.counter > 10) {
        //   console.log("RETURN");
        //   return;
        // }
        if (!partsOfSpeechMap[partOfSpeechRaw]) {
          console.log("RETURN");
          continue;
        } else {
          console.log("partOfSpeechRaw exists in map, continue...");
        }
        //let plWord = "polskie_slowo";
        //console.log("BEFORE translate word: ", word);
        //let plWord = await this.translateWord(word);
        //console.log("AFTER translate word: ", word);
        // let plWordEntity = this.wordRepo.create({
        //   lang: "pl",
        //   word: plWord,
        //   isIdiom: false,
        //   isPhrasalVerb: false,
        //   origin: "b1-cambridge-list",
        //   freq: 1
        // });
        // let plWordSaved = await this.wordRepo.save(plWordEntity);
        // let polishParticle = this.wordParticleRepo.create({
        //   wordParticle: plWord,
        //   wordEntity: plWordSaved
        // });
        // await this.wordParticleRepo.save(polishParticle);

        // let engWordEntity = this.wordRepo.create({
        //   lang: "en",
        //   word: word,
        //   isIdiom: false,
        //   isPhrasalVerb: false,
        //   needsTranslation: true,
        //   origin: "a2-list",
        //   freq: 1
        // });
        // console.log("created: ", engWordEntity);
        // let enWordSaved = await this.wordRepo.save(engWordEntity);
        // let englishParticle = this.wordParticleRepo.create({
        //   wordParticle: word,
        //   wordEntity: enWordSaved
        // });
        // await this.wordParticleRepo.save(englishParticle);
        //
        // let meaning = this.meaningRepo.create({
        //   partOfSpeech: partsOfSpeechMap[partOfSpeechRaw],
        //   meaning_lang1_language: "pl",
        //   meaning_lang2_language: "en",
        //   category: "general"
        // });
        // let savedMeaning = await this.meaningRepo.save(meaning);
        // // let plLink = this.linkRepo.create({
        // //   meaningId: savedMeaning.id,
        // //   wordId: plWordSaved.id,
        // //   level: "B1"
        // // });
        // // await this.linkRepo.save(plLink);
        // let enLink = this.linkRepo.create({
        //   meaningId: savedMeaning.id,
        //   wordId: enWordSaved.id,
        //   level: "A2"
        // });
        // await this.linkRepo.save(enLink);
        this.sem.leave();
      }

      // words.forEach(async word => {
      //   const wordEntity = this.wordRepo.create({
      //     word
      //   });
      //   try {
      //     await this.wordRepo.save(wordEntity);
      //   } catch (err) {
      //     //console.log('err: ', err);
      //   }
      // });
    });
    pdfParser.on("error", err => console.error("Parser Error", err));
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
      fs.writeFile("./pdf2json/test/F1040EZ.fields.json", JSON.stringify(pdfParser.getAllFieldsTypes()), () => {
        console.log("Done.");
      });
    });

    //pdfParser.loadPDF("./pdfs/sample.pdf");
    pdfParser.loadPDF("./pdfs/a2-words.pdf");

    //console.log('translated: ', translated);
  }

  async processMacedonianPdf(level: string) {
    const pdfParser = new PDFParser();
    pdfParser.on("readable", meta => console.log("PDF Metadata", meta));
    pdfParser.on("data", async page => {
      // console.log(page ? "One page paged" : "All pages parsed", page)

      await new Promise<void>((resolve) => {
        this.semOuter.take(1, function() {
          resolve();
        });
      });


      if (page == null) {
        return;
      }
      console.log("====================== ", this.counter);
      //let words = this.extractWords(page, this.processSamplePdfLine);
      /**
       "verb",
       "noun",
       "adjective",
       "adverb",
       "preposition"
       */
      const partsOfSpeechMap = {
        "VERB": "verb",
        "NOUN": "noun",
        "ADJECTIVE": "adjective",
        "ADVERB": "adverb",
        "PREPOSITION": "preposition",
        "PRONOUN": "pronoun"
      };

      let words = [];
      console.log("page number " + this.counter);
      // if (this.counter > 30) {
      //   return;
      // }
      words = this.extractWordsForMacedonianPdf(page);
      console.log("words: ", words);
      this.counter++;
      // if (this.counter > 3) {
      //   return;
      // }
      for (let wordObj of words) {
        //console.log("wordObj: ", wordObj);
        await new Promise<void>((resolve) => {
          this.sem.take(1, function() {
            resolve();
          });
        });
        let word = wordObj.word;
        let partOfSpeechRaw = wordObj.partOfSpeechRaw;

        // word = removeDotAtTheEnd(word);
        let existingWord = await this.wordRepo
          .createQueryBuilder("word")
          .select()
          .innerJoinAndSelect("word.meanings", "links")
          .innerJoinAndSelect("links.meaning", "meaning")
          .innerJoinAndSelect("meaning.words", "words")
          .where("word.word = :word", {
            word
          })
          .getOne();

        if (existingWord) {
          console.log("word ", word, " already exists");
          // console.log("word: ", word, " already exist, setting to " + level);
          // for (let link of existingWord.meanings) {
          //   const meaning = link.meaning;
          //   meaning.partOfSpeech = partsOfSpeechMap[partOfSpeechRaw];
          //   await this.meaningRepo.save(meaning);
          //   for (let link2 of link.meaning.words) {
          //     link2.level = level;
          //     await this.linkRepo.save(link2);
          //   }
          // }
        } else {
          console.log("creating word: ", word);
          let engWordEntity = this.wordRepo.create({
            lang: "en",
            word: word,
            isIdiom: false,
            isPhrasalVerb: false,
            needsTranslation: true,
            origin: "a1-macedonia-cut",
            freq: 1
          });
          console.log("created: ", engWordEntity);
          let enWordSaved = await this.wordRepo.save(engWordEntity);
          for (let particle of word.split(" ")) {
            let englishParticle = this.wordParticleRepo.create({
              wordParticle: particle,
              wordEntity: enWordSaved
            });
            await this.wordParticleRepo.save(englishParticle);
          }
          console.log("NEW word: ", word);

          let meaning = this.meaningRepo.create({
            partOfSpeech: partsOfSpeechMap[partOfSpeechRaw],
            meaning_lang1_language: "pl",
            meaning_lang2_language: "en",
            category: "general"
          });
          let savedMeaning = await this.meaningRepo.save(meaning);

          let enLink = this.linkRepo.create({
            meaningId: savedMeaning.id,
            wordId: enWordSaved.id,
            level: level
          });
          await this.linkRepo.save(enLink);
        }
        this.sem.leave();
      }

      // words.forEach(async word => {
      //   const wordEntity = this.wordRepo.create({
      //     word
      //   });
      //   try {
      //     await this.wordRepo.save(wordEntity);
      //   } catch (err) {
      //     //console.log('err: ', err);
      //   }
      // });
      this.semOuter.leave();
    });
    pdfParser.on("error", err => console.error("Parser Error", err));
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
      fs.writeFile("./pdf2json/test/F1040EZ.fields.json", JSON.stringify(pdfParser.getAllFieldsTypes()), () => {
        console.log("Done.");
      });
    });

    //pdfParser.loadPDF("./pdfs/sample.pdf");
    pdfParser.loadPDF("./pdfs/a1-macedonia-cut.pdf");

    //console.log('translated: ', translated);
  }


  async translateWordsWithNeedsTranslationFlag() {

    let meanings = await this.meaningRepo.createQueryBuilder("meaning")
      .select()
      .innerJoinAndSelect("meaning.words", "link")
      .innerJoinAndSelect("link.word", "word", "word.needsTranslation = 1")
      .getMany();


    //meanings = meanings.slice(0, 2);

    for (let meaning of meanings) {
      //console.log("meaning: ", JSON.stringify(row, null, 2));
      const encodedParams = new URLSearchParams();
      ;
      if (meaning.words[0].word.lang !== "en") {
        continue;
      }
      console.log("now translating: ", meaning.words[0].word.word);
      encodedParams.append("q", meaning.words[0].word.word);
      encodedParams.append("target", "pl");
      encodedParams.append("source", "en");

      const options = {
        method: "POST",
        url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "Accept-Encoding": "application/gzip",
          "X-RapidAPI-Key": "9955f8dc65mshea2d9990a9ad31fp10acebjsn8052d4e2a1a6",
          "X-RapidAPI-Host": "google-translate1.p.rapidapi.com"
        },
        data: encodedParams
      };

      let res_ = await axios.request(options);
      let translated = res_.data.data.translations[0].translatedText;
      console.log("translated: ", translated);
      console.log("level: ", meaning.words[0].level);
      console.log("===================================");

      let word = this.wordRepo.create({
        word: translated,
        lang: "pl",
        needsTranslation: true,
        isPhrasalVerb: false,
        isIdiom: false,
        freq: 1,
        origin: "rapid-api-google-translate"
      });
      let savedWord = await this.wordRepo.save(word);

      for (let particle of word.word.split(/ +/)) {
        let wordParticle = this.wordParticleRepo.create({
          wordEntity: word,
          wordParticle: particle
        });
        await this.wordParticleRepo.save(wordParticle);
        console.log("saving word particle: ", particle);
      }

      let link = this.linkRepo.create({
        wordId: savedWord.id,
        meaningId: meaning.id,
        level: meaning.words[0].level
      });
      await this.linkRepo.save(link);

      let englishWord = meaning.words[0].word;
      englishWord.needsTranslation = false;
      await this.wordRepo.save(englishWord);
    }
  }

  async testDiki(word: string) {
    const dict = {
      "przymiotnik": "adjective",
      "rzeczownik": "noun",
      "czasownik": "verb",
      "przysłówek": "adverb",
      "przyimek": "preposition",
      "liczebnik": "numeral"
    };
    return await new Promise((resolve, reject) => {
      fetch("https://www.diki.pl/slownik-angielskiego?q=" + word)
        .then(async result => {
          try {
            let html = await result.text();
            const root = parse(html);
            let dictionaryEntity = root.querySelector(".dictionaryEntity");
            let titleNode = root.querySelector(".dictionaryEntity .hws .hw");
            const title = titleNode.childNodes[0].rawText;
            //console.log("title: ", title);

            let partOfSpeechNode = root.querySelector(".dictionaryEntity");
            //console.log('node: ', partOfSpeechNode);
            partOfSpeechNode.childNodes.map(el => {
              let parsed = parse(el.toString());
              if (parsed) {
                let el = parsed.querySelector(".partOfSpeechSectionHeader .partOfSpeech")?.rawText;
                if (dict[el]) {
                  //console.log("el: ", dict[el]);
                  resolve(dict[el]);
                  return;
                }
                let list = parsed.querySelector(".nativeToForeignEntrySlices");
                if (list) {
                  let filteredList = list?.childNodes.map(el => el.rawText);
                  filteredList = filteredList.map(el => el.replaceAll(/\n +/ig, ""));
                  filteredList = filteredList.filter(el => !!el);
                  filteredList = filteredList.map(el => {
                    let regexpMatch = /^(\w+) .*/;
                    let match = el.match(regexpMatch);
                    return match ? match[1] : "";
                  });
                  //console.log("list: ", filteredList);
                }
              }
            });
            reject();

          } catch (e) {
            reject();
          }
          //console.log('.dictionaryEntity', dictionaryEntity.toString());
        });
    });
  }

  async populatePartOfSpeechWithDiki() {
    let plWords = await this.wordRepo
      .createQueryBuilder("word")
      .innerJoinAndSelect("word.meanings", "links")
      .innerJoinAndSelect("links.meaning", "meaning")
      .where({
        lang: "pl",
        needsTranslation: true
      })
      .andWhere("word.id < 11900")
      .orderBy("word.id", "DESC")
      .getMany();
    //plWords = plWords.slice(0, 3);
    console.log("polish words: ", plWords);
    for (let word of plWords) {
      try {
        console.log("word.word: ", word.word);
        let result = await this.testDiki(word.word);
        console.log("result: ", word.word, word.id, result);
        for (let link of word.meanings) {
          let meaning = link.meaning;
          // @ts-ignore
          meaning.partOfSpeech = result;
          //console.log("mmeaning: ", meaning);
          await this.meaningRepo.save(meaning);
        }
      } catch (e) {
        console.log("error: ", e);
      }
    }
  }

  async createSentence() {

    const options = {
      method: "GET",
      url: "https://sentencedict.com/guitar.html",
    };

    try {
      let result = await axios.request(options);
      //console.log('result.data: ', result.data);
      let html = result.data;
      const root = parse(html);
      let dictionaryEntity = root.querySelector("#all div");
      const title = dictionaryEntity.childNodes[0];
      let buildSentence = [];
      for(let node of title.parentNode.childNodes) {
        if(node.rawText) {
          console.log('node.rawText: ', node.rawText);
          buildSentence.push(node.rawText);
        } else {
          console.log('else: ');
          for(let node_ of node.childNodes) {
            console.log('node_: ', node_);
          }
        }
      }
      console.log('sentence: ', buildSentence.join(''));
    } catch(e) {
      console.log('error: ', e);

    }
  }

  async createSentence2() {

    const options = {
      method: "GET",
      url: "https://sentence.yourdictionary.com/carpet",
    };

    try {
      let result = await axios.request(options);
      //console.log('result.data: ', result.data);
      let html = result.data;
      const root = parse(html);
      let dictionaryEntity = root.querySelector(".sentences-list li div div div p");
      //console.log('dict: ', dictionaryEntity.parentNode.childNodes);
      //console.log('dict: ', dictionaryEntity.childNodes);
      let builtSentence = [];
      dictionaryEntity.childNodes.forEach(el => {
        //console.log('rawText: ', el.rawText);
        builtSentence.push(el.rawText);
      })
      console.log('sentence: ', builtSentence.join(''));
      // let obj = (dictionaryEntity.parentNode.childNodes[0] .childNodes as any);
      // console.log('first li: ', obj[0]);
      // const title = dictionaryEntity.childNodes[0];
      // let buildSentence = [];
      // for(let node of title.parentNode.childNodes) {
      //   if(node.rawText) {
      //     console.log('node.rawText: ', node.rawText);
      //     buildSentence.push(node.rawText);
      //   } else {
      //     console.log('else: ');
      //     for(let node_ of node.childNodes) {
      //       console.log('node_: ', node_);
      //     }
      //   }
      // }
      //console.log('sentence: ', buildSentence.join(''));
    } catch(e) {
      console.log('error: ', e);

    }
  }

  async onModuleInit(): Promise<any> {
    console.log("on module INIT");

    await this.createSentence2();
    //await this.processMacedonianPdf("A1");
    //await this.translateWordsWithNeedsTranslationFlag();

    // await this.populatePartOfSpeechWithDiki();

    // let plWords = await this.meaningRepo
    //   .createQueryBuilder("meaning")
    //   .leftJoinAndSelect("meaning.words", "links")
    //   .leftJoinAndSelect("links.word", "word")
    //   .where({
    //     partOfSpeech: IsNull()
    //   })
    //   .getMany();
    //
    // console.log("words: ", JSON.stringify(plWords, null, 2));

    // let moc = await this.meaningRepo
    //   .createQueryBuilder("meaning")
    //   .select()
    //   .innerJoinAndSelect("meaning.words", "words")
    //   .innerJoinAndSelect("words.word", "word")
    //   .innerJoinAndSelect("word.wordParticles", "wordParticles")
    //   .where({
    //     id: 3591
    //   })
    //   .getOne();
    //
    // console.log("moc meaning: ", JSON.stringify(moc, null, 2));

    // let mocWord = await this.wordRepo
    //   .createQueryBuilder("word")
    //   .select()
    //   .where({
    //     id: 9720
    //   })
    //   .getOne();
    // console.log("mocWord: ", mocWord);

    // let mocParticle = this.wordParticleRepo.create({
    //   wordParticle: "moc",
    //   wordEntity: mocWord
    // });
    // await this.wordParticleRepo.save(mocParticle);
    //
    // console.log("moc: ", JSON.stringify(moc, null, 2));

    // let mocWord = this.wordRepo.create({
    //   word: "moc",
    //   needsTranslation: false,
    //   origin: "backend-generation",
    //   freq: 1,
    //   isIdiom: false,
    //   isPhrasalVerb: false,
    //   desc: ""
    // });
    // let savedMoc = await this.wordRepo.save(mocWord);
    //
    // let link = this.linkRepo.create({
    //   wordId: savedMoc.id,
    //   meaningId: moc.id,
    //   level: "B1"
    // });
    // await this.linkRepo.save(link);
    // console.log("saved");

    // let words = await this.wordRepo.createQueryBuilder("word")
    //   .select()
    //   .where({
    //     origin: "rapid-api-google-translate"
    //   })
    //   .getMany();

    // words = words.slice(0, 2);
    // console.log("words: ", words);


    // for (let word of words) {
    //   let result = await this.wordParticleRepo.manager.query(`
    //     DELETE FROM word_particle WHERE wordEntityId = ${word.id}
    //   `);
    //   console.log("result: ", result);
    // }


    // console.log("words.length: ", words.length);
    // for (let word of words) {
    //   console.log("word: ", word);
    //   for (let particle of word.word.split(/ +/)) {
    //     let wordParticle = this.wordParticleRepo.create({
    //       wordEntity: word,
    //       wordParticle: particle
    //     });
    //     await this.wordParticleRepo.save(wordParticle);
    //     console.log("saving word particlce: ", particle);
    //   }
    // }


//     let result = await this.meaningRepo.manager.query(`
//    SELECT COUNT(meaning_entity.id) as count, MAX(meaning_entity.id) as id FROM meaning_entity
// INNER JOIN meaning_word_jointable as link ON link.meaningId = meaning_entity.id
// group by meaning_entity.id
// HAVING count = 1 AND MIN(meaning_entity.id) = MAX(meaning_entity.id)
//     `);
    //console.log("result: ", result);
    return;
    // await this.processPdfFile();
    // await this.processMacedonianPdf("A1");
    // let meaning = await this.meaningRepo.createQueryBuilder("meaning")
    //   .select()
    //   .innerJoinAndSelect("meaning.words", "words")
    //   .innerJoinAndSelect("words.word", "word")
    //   .where({
    //     id: 3395
    //   })
    //   .getOne();
    // console.log("meaning: ", JSON.stringify(meaning));
    // for (var i = 0; i < 10; ++i) {
    //   console.log(nrand());
    // }

  }

}
