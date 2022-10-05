import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LangType, MeaningEntity } from "../meaning/meaning.entity";
import { parse } from "node-html-parser";
import { WordEntity } from "./word.entity";
import WordParticle from "./word-particle.entity";
import { LinkEntity } from "../meaning/link.entity";

const axios = require("axios");

const fetch = require("node-fetch");

const fs = require("fs");
const PDFParser = require("pdf2json");


@Injectable()
export class WordService implements OnModuleInit {
  constructor(
    @InjectRepository(WordEntity)
    private wordRepo: Repository<WordEntity>,
    @InjectRepository(WordParticle)
    private wordParticleRepo: Repository<WordParticle>,
    @InjectRepository(MeaningEntity)
    private meaningRepo: Repository<MeaningEntity>
  ) {
  }

  public async searchByText(search: string): Promise<WordEntity[]> {
    const result: WordEntity[] = await this.wordRepo
      .createQueryBuilder("word")
      .innerJoinAndSelect("word.wordParticles", "wordParticles")
      .where("wordParticles.wordParticle LIKE :search", {
        search: search + "%"
      })
      .take(20)
      .getMany();
    return result;
  }

  public async wordExists(word: string): Promise<WordEntity> {
    let wordEntity = await this.wordRepo
      .createQueryBuilder()
      .where({
        word
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

    let result = await axios.request(options);
    console.log("word.data: ", result.data);

    return result.data.data.translations[0].translatedText;
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

  extractWords(page, processLine: (line: string[], prevLine: string[]) => string[]) {
    let words = [];
    let prevLine;
    page.Texts.forEach(rawLine => {
      let line = rawLine.R[0].T.split("%20");
      let cleanedUpWords = processLine(line, prevLine);
      words.push(...cleanedUpWords);
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
  }

  counter = 0;

  async processPdfFile() {
    const pdfParser = new PDFParser();
    pdfParser.on("readable", meta => console.log("PDF Metadata", meta));
    pdfParser.on("data", page => {
      //console.log(page ? "One page paged" : "All pages parsed", page)
      this.counter++;
      // if(this.counter > 20) {
      //   return;
      // }
      console.log("====================== ", this.counter);
      //let words = this.extractWords(page, this.processSamplePdfLine);
      let words = this.extractWords(page, this.processB1CambridgeVocabularyLine);
      console.log("words: ", words);
      words.forEach(async word => {
        const wordEntity = this.wordRepo.create({
          word
        });
        try {
          await this.wordRepo.save(wordEntity);
        } catch (err) {
          //console.log('err: ', err);
        }
      });
    });
    pdfParser.on("error", err => console.error("Parser Error", err));
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
      fs.writeFile("./pdf2json/test/F1040EZ.fields.json", JSON.stringify(pdfParser.getAllFieldsTypes()), () => {
        console.log("Done.");
      });
    });

    //pdfParser.loadPDF("./pdfs/sample.pdf");
    pdfParser.loadPDF("./pdfs/b1-cambridge-list.pdf");

    //console.log('translated: ', translated);
  }

  // async translateWords() {
  //   let words: MeaningEntity[] = await this.wordRepo
  //     .createQueryBuilder("user")
  //     .getMany();
  //   words.forEach(async word => {
  //     word.lang_polish = await this.translateWord(word.lang_english);
  //     console.log('waord.lang.polish: ', word.lang_polish);
  //     await this.wordRepo.save(word);
  //   })
  // }

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

  async testDiki() {

    fetch("https://www.diki.pl/slownik-angielskiego?q=ograniczony")
      .then(async result => {
        let html = await result.text();
        const root = parse(html);
        let dictionaryEntity = root.querySelector(".dictionaryEntity");
        let titleNode = root.querySelector(".dictionaryEntity .hws .hw");
        const title = titleNode.childNodes[0].rawText;
        console.log("title: ", title);

        let partOfSpeechNode = root.querySelector(".dictionaryEntity");
        //console.log('node: ', partOfSpeechNode);
        partOfSpeechNode.childNodes.map(el => {
          let parsed = parse(el.toString());
          if (parsed) {
            let el = parsed.querySelector(".partOfSpeechSectionHeader .partOfSpeech")?.rawText;
            if (el) {
              console.log("el: ", el);
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
              console.log("list: ", filteredList);
            }
          }
        });
        //console.log('partOfSpeech: ', partOfSpeech);
        //console.log('.dictionaryEntity', dictionaryEntity.toString());
      });
  }

  async onModuleInit(): Promise<any> {
    console.log("on module INIT");
    // const allWords = await this.wordRepo
    //   .createQueryBuilder("word")
    //   .leftJoinAndSelect("word.meanings", "link")
    //   .leftJoinAndSelect("link.meaning", "meaning")
    //   .getMany();
    // console.log("allWords: ", allWords);
    // for (const word of allWords) {
    //   //console.log("word: ", word);
    //   if (word.meanings.some(link => link.meaning.partOfSpeech === "phrasal verb")) {
    //     console.log("phrasal verb: ", word);
    //     // word.isPhrasalVerb = true;
    //     await this.wordRepo.update({ id: word.id }, {
    //       isPhrasalVerb: true
    //     });
    //     // await this.wordRepo.save(word);
    //   }
    // }
    // const allWords = await this.wordRepo
    //   .createQueryBuilder("word")
    //   .select()
    //   .leftJoinAndSelect("word.wordParticles", "particles")
    //   .getMany();
    // console.log("allWords: ", allWords);

    //console.log("allWords: ", allWords);
    // allWords.forEach(async word => {
    //   let particles: string[] = word.word.split(/ +/);
    //   //console.log("particles: ", particles);
    //   word.wordParticles =
    //     particles.map(particle =>
    //       this.wordParticleRepo.create({ wordParticle: particle })
    //     );
    //   await this.wordRepo.save(word);
    // });
    //await this.deleteOrphanWords(5);
    // await this.testDiki();
    // await this.processPdfFile();
    // await this.translateWords();
    // await this.test();
  }

}
