import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
import { WordEntity } from './word.entity';
import { log } from 'util';
const axios = require("axios");

const fs = require('fs');
const PDFParser = require("pdf2json");


@Injectable()
export class WordService implements OnModuleInit {
  constructor(
    @InjectRepository(WordEntity)
    private wordRepo: Repository<WordEntity>,
  ) {}

  private async translateWord(word: string): Promise<string> {

    const encodedParams = new URLSearchParams();
    encodedParams.append("q", word);
    encodedParams.append("target", "pl");
    encodedParams.append("source", "en");

    const options = {
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

    let result = await axios.request(options);
    console.log('word.data: ', result.data);

    return result.data.data.translations[0].translatedText;
  }

  processB1CambridgeVocabularyLine(line: string[], prevLine: string[]) {
    let words = [];
    line.forEach(word => {
      //filters
      if(!(
        !word ||
        /[\(\)\%]/.test(word) || // if contains '(' , ')' or '%'
        word.length === 1 ||
        /^\d+$/.test(word) || // exclude digits
        word === 'B1'
      )) {
        word = word.replace('.','').toLowerCase();
        if(![
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
  }

  processSamplePdfLine(line: string[], prevLine: string[]) {
    let words = [];
    let lastWordInPrevLine = prevLine && prevLine[prevLine.length-1];
    if(lastWordInPrevLine?.slice(-1) === '-') {
      line[0] = lastWordInPrevLine.slice(0, -1) + line[0]
    }
    let finalLine = [];
    line.forEach((word: any, idx) => {
      word = word.replaceAll(/\%../ig, '');
      word = word.replaceAll('.', '');
      word = word.toLowerCase();
      if(!(idx === line.length - 1 || word.slice(-1) === '-')) { //if last word
        if(!word || word === '.' || word === ',' || /^\d+$/.test(word) || word.length === 1) {

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
      let line = rawLine.R[0].T.split('%20');
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
    pdfParser.on("readable", meta => console.log("PDF Metadata", meta) );
    pdfParser.on("data", page => {
      //console.log(page ? "One page paged" : "All pages parsed", page)
      this.counter++;
      // if(this.counter > 20) {
      //   return;
      // }
      console.log('====================== ', this.counter);
      //let words = this.extractWords(page, this.processSamplePdfLine);
      let words = this.extractWords(page, this.processB1CambridgeVocabularyLine);
      console.log('words: ', words);
      words.forEach(async word => {
        const wordEntity = this.wordRepo.create({
          lang_english: word,
          desc: 'b1-cambridge-list.pdf',
          level: 'B1',
          freq: 1
        });
        try {
          await this.wordRepo.save(wordEntity);
        } catch (err) {
          //console.log('err: ', err);
        }
      });
    });
    pdfParser.on("error", err => console.error("Parser Error", err));
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
      fs.writeFile("./pdf2json/test/F1040EZ.fields.json", JSON.stringify(pdfParser.getAllFieldsTypes()), ()=>{console.log("Done.");});
    });

    //pdfParser.loadPDF("./pdfs/sample.pdf");
    pdfParser.loadPDF("./pdfs/b1-cambridge-list.pdf");

    //console.log('translated: ', translated);
  }

  async translateWords() {
    let words: WordEntity[] = await this.wordRepo
      .createQueryBuilder("user")
      .getMany();
    words.forEach(async word => {
      word.lang_polish = await this.translateWord(word.lang_english);
      console.log('waord.lang.polish: ', word.lang_polish);
      await this.wordRepo.save(word);
    })
  }

  async onModuleInit(): Promise<any> {
    console.log('on module init');
    //await this.processPdfFile();
    // await this.translateWords();
  }

}
