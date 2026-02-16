import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { decode as atob } from "base-64";
import RNBlobUtil from "react-native-blob-util";

// Worker Setup
pdfjsLib.GlobalWorkerOptions.workerSrc =
  require("pdfjs-dist/legacy/build/pdf.worker.js");

export const searchTextInPdf = async (filePath, keyword) => {
  try {
    const base64Data = await RNBlobUtil.fs.readFile(filePath, "base64");

    const pdfData = atob(base64Data);

    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");

      if (pageText.toLowerCase().includes(keyword.toLowerCase())) {
        return pageNum; // ✅ Found page
      }
    }

    return -1;
  } catch (err) {
    console.log("PDF Search Error:", err);
    return -1;
  }
};
