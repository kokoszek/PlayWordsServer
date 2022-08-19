import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WordEntity } from './word.entity';
import { log } from 'util';
const axios = require("axios");

const fs = require('fs');
const PDFParser = require("pdf2json");

const pdfParser = new PDFParser();

@Injectable()
export class WordService implements OnModuleInit {
  constructor(
    @InjectRepository(WordEntity)
    private workRepo: Repository<WordEntity>,
  ) {}

  private async translateWord(word: string): Promise<string> {

    const encodedParams = new URLSearchParams();
    encodedParams.append("q", word);
    encodedParams.append("target", "en");
    encodedParams.append("source", "pl");

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

  extractWords(page) {
    let words = [];
    let prevLine;
    page.Texts.forEach(rawLine => {
      let line = rawLine.R[0].T.split('%20');
      // console.log('--------');
      // console.log('prevLine: ', prevLine);
      // console.log('line: ', line);
      let lastWordInPrevLine = prevLine && prevLine[prevLine.length-1];
      if(lastWordInPrevLine?.slice(-1) === '-') {
        line[0] = lastWordInPrevLine.slice(0, -1) + line[0]
      }
      let finalLine = [];
      line.forEach((word, idx) => {
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
  async onModuleInit(): Promise<any> {
    console.log('on module init');

    pdfParser.on("readable", meta => console.log("PDF Metadata", meta) );
    pdfParser.on("data", page => {
      //console.log(page ? "One page paged" : "All pages parsed", page)
      this.counter++;
      if(this.counter > 20) {
        return
      }
      console.log('====================== ', this.counter);
      let words = this.extractWords(page);
      console.log('words: ', words);
    });
    pdfParser.on("error", err => console.error("Parser Error", err));
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
      fs.writeFile("./pdf2json/test/F1040EZ.fields.json", JSON.stringify(pdfParser.getAllFieldsTypes()), ()=>{console.log("Done.");});
    });

    //pdfParser.loadPDF("./sample.pdf");
    pdfParser.loadPDF("./pdfs/b1-cambridge-list.pdf");

    let translated = await this.translateWord('policja');
    console.log('translated: ', translated);

    const word = this.workRepo.create({
      lang_polish: 'pies',
      lang_english: 'dog',
      desc: 'test',
      level: 1
    });
    //await this.workRepo.save(word)
  }

}
