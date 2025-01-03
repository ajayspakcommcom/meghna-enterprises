import React, { useState, useCallback, useMemo } from "react";
const converter = require('number-to-words');

export default function Index() {

  const numberToIndianWords = (num: number): string => {
    if (num === 0) return "Zero";

    const belowTwenty = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const units = ["", "Thousand", "Lakh", "Crore"];

    // Recursive function to convert numbers below 1000
    const belowThousand = (n: number): string => {
      if (n === 0) return "";
      if (n < 20) return belowTwenty[n] + " ";
      if (n < 100) return tens[Math.floor(n / 10)] + " " + belowTwenty[n % 10] + " ";
      return belowTwenty[Math.floor(n / 100)] + " Hundred " + belowThousand(n % 100);
    };

    // Handle integer part of the number
    const convertIntegerPart = (n: number): string => {
      let result = "";
      let unitIndex = 0;

      while (n > 0) {
        const chunk = unitIndex === 0 ? n % 1000 : n % 100; // First group is 3 digits, rest are 2 digits
        if (chunk > 0) {
          result = belowThousand(chunk) + units[unitIndex] + " " + result;
        }
        n = unitIndex === 0 ? Math.floor(n / 1000) : Math.floor(n / 100);
        unitIndex++;
      }

      return result.trim();
    };

    // Split the number into integer and decimal parts
    const [integerPart, decimalPart] = num.toString().split(".");

    const integerWords = convertIntegerPart(parseInt(integerPart, 10));
    let decimalWords = "";

    if (decimalPart && parseInt(decimalPart, 10) > 0) {
      const decimalDigits = decimalPart.split("").map(digit => belowTwenty[parseInt(digit, 10)]);
      decimalWords = "Point " + decimalDigits.join(" ");
    }

    return (integerWords + " " + decimalWords).trim() + " Only";
  };


    return (
        <>
          <h1>{numberToIndianWords(100000)}</h1>          
          <h1>{numberToIndianWords(25055)}</h1>  
          <h1>{numberToIndianWords(26000)}</h1>          
        </>
    );
}


