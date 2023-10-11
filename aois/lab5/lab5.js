function intToBinaryArr(num, places)
{
  var binaryArr = [];
  while(binaryArr.length < places)
  {
    binaryArr.push(num % 2);
    num = Math.floor(num / 2);
  }
  return binaryArr.reverse();
}

function truthTableToFDNF(truthTable)
{
  var truthTableHeight = truthTable.length;
  var truthTableWidth = truthTable[0].length;
  var resultStr = "";
  for(let j = 0; j < truthTableWidth; j++)
  {
    if(truthTable[truthTableHeight - 1][j] == 1)
    {
      var currConstituentStr = "";
      for(let i = 0; i < truthTableHeight - 1; i++)
      {
        if(truthTable[i][j] == 0) currConstituentStr += '!';
        currConstituentStr += 'x' + String(i + 1) + ' * ';
      }
      resultStr += '(' + currConstituentStr.slice(0, currConstituentStr.length - 3) + ") + ";
    }
  }
  return resultStr.slice(0, resultStr.length - 3);
}

function createTruthTable(additiveType, states)
{
  if(typeof(additiveType) != "boolean" || isNaN(states) || (states % 1 != 0))
  {
    console.log("Incorrect input");
  }
  var argumentQuantity = 1;
  while(Math.pow(2, argumentQuantity) < states) argumentQuantity++;
  var truthTable = new Array(3 * argumentQuantity + 1);
  for(let i = 0; i < truthTable.length; i++) truthTable[i] = new Array(states);
  var currTMinusOneState = additiveType ? 0 : states - 1;
  for(let j = 0; j < states * 2; j++)
  {
    var currStateInBinary = intToBinaryArr(currTMinusOneState, argumentQuantity);
    for(let i = 0; i < argumentQuantity; i++)
    {
      truthTable[i][j] = currStateInBinary[i];
    }
    j++;
    for(let i = 0; i < argumentQuantity; i++)
    {
      truthTable[i][j] = currStateInBinary[i];
    }
    additiveType ? currTMinusOneState++ : currTMinusOneState--;
  }
  for(let j = 0; j < states * 2; j++) truthTable[argumentQuantity][j] = j % 2;
  for(let j = 0; j < states * 2; j++)
  {
    for(let i = argumentQuantity + 1; i < argumentQuantity * 2 + 1; i++)
    {
      truthTable[i][j] = truthTable[i - argumentQuantity][(j + 1) % (states * 2)];
    }
  }
  for(let j = 0; j < states * 2; j++)
  {
    for(let i = argumentQuantity * 2 + 1; i < argumentQuantity * 3 + 1; i++)
    {
      if(truthTable[i - 1 - argumentQuantity * 2][j] != truthTable[i - 1 - argumentQuantity][j]) truthTable[i][j] = 1;
      else truthTable[i][j] = 0;
    }
  }
  return truthTable;
}

function get_hi_function(truthTable, i)
{
  var triggerQuantity = (truthTable.length - 1) / 3;
  var hi_truthTable = [];
  for(let ind = 0; ind < triggerQuantity + 1; ind++) hi_truthTable.push(truthTable[ind]);
  hi_truthTable.push(truthTable[truthTable.length - i]);
  return lab3.minimize(truthTableToFDNF(hi_truthTable)).split('x').join('q').split('q' + String(triggerQuantity + 1)).join('V');
}

function readlinePromise(message)
{
  return new Promise((resolve, reject) => 
  {
    var readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    readline.question(message, input =>
    {
      readline.close();
      resolve(input);
    });
  });
}

const lab3 = require('../lab3js/./lab3functions.js');

async function lab4()
{
  var states, type;
  var firstIteration = true;
  do
  {
    if(!firstIteration) console.log("Incorrect input. ");
    states = Number(await readlinePromise("Input the number of states of your machine: "));
    firstIteration = false;
  }
  while(isNaN(states) || states % 1 != 0 || states < 1);

  firstIteration = true;
  do
  {
    if(!firstIteration) console.log("Incorrect input. ");
    type = Number(await readlinePromise("What type will your machine be? 0 - subtractive, 1 - additive: "));
    firstIteration = false;
  }
  while(isNaN(type) || type % 1 != 0 || type < 0 || type > 1);
  
  var truthTable = createTruthTable(type, states);
  var choice = 0;
  var lastInputIncorrect = false;
  var argumentQuantity = Math.round(Math.pow(truthTable[0].length / 2, 1/2));
  console.log(argumentQuantity);
  while(true)
  {
    if(lastInputIncorrect) console.log("Incorrect input. ");
    lastInputIncorrect = false;
    choice = Number(await readlinePromise("Input the index of the h_i function to minimize, or input -1 to leave: "));
    if(isNaN(choice) || choice % 1 != 0 || choice < -1 || choice > argumentQuantity) 
    {
      lastInputIncorrect = true;
      continue;
    }
    if(choice == -1) break;
    console.log(get_hi_function(truthTable, choice));
  }
}

lab4()