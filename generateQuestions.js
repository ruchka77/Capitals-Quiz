const fs = require("fs");
const path = require("path");

const getCapitalQuiz = async () => {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all");
    if (!res.ok) throw new Error("Failed to fetch countries");

    const data = await res.json();

    const allCountries = data
      .filter(c => c.capital && c.capital.length > 0 && c.name?.common && c.name?.common !== "Palestine" && c.capital !== "Ramallah")
      .map(c => ({
        country: c.name.common,
        capital: c.capital[0],
        flag: c.flags?.png || c.flags?.svg || ""
      }));
   
    const shuffle = (arr) => arr.sort(() => 0.5 - Math.random());
    
    const quiz = allCountries.map(({ country, capital, flag}) => {
      const wrongCapitals = shuffle(
        allCountries.filter(c => c.capital !== capital).map(c => c.capital)
      ).slice(0, 3);
      
      const options = shuffle([capital, ...wrongCapitals]);

      return {
        question: `What is the capital of ${country}?`,
        answer: capital,
        options,
        flag: flag || "",
      };
    });

    const outputDir = path.join(__dirname, "data");
    const outputPath = path.join(outputDir, "questions.json");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    fs.writeFileSync(outputPath, JSON.stringify(quiz, null, 2), "utf-8");
    console.log(`✅ ${quiz.length} questions saved to ${outputPath}`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
};

getCapitalQuiz();


// Async function helps the code run while the function still loads

