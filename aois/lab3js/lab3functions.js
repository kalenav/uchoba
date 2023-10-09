function quantityToSet(argumentsQuantity)
{
  var result = {};
  for(let i = 1; i <= argumentsQuantity; i++)
  {
    result[String(i)] = 1;
  }
  return result;
}

function getNegatedArguments(input)
{
  var negatedArguments = {};
  for(let i = 0; i < input.length; i++)
  {
    if(input[i] == 'x')
    {
      if(input[i - 1] == '!') negatedArguments[input[i + 1]] = true;
      else negatedArguments[input[i + 1]] = false;
    }
  }
  return negatedArguments;
}

function clearParentheses(input)
{
  return input.slice(1, input.length - 1);
}

function isSKNF(input, argumentsQuantity)
{
  var allowedCharacters = 
  {
    "x": 1,
    "(": 1,
    ")": 1,
    "!": 1,
    "+": 1,
    "*": 1,
    " ": 1
  }
  var argumentNumbers = quantityToSet(argumentsQuantity);
  for(let i = 0; i < input.length; i++)
  {
    if(!(input[i] in allowedCharacters || input[i] in argumentNumbers)) return false;
  }
  var distinctArgumentsInCurrentParenthesesSet = 0;
  var readingSymbols = false;
  var foundArguments = {};
  for(let i = 0; i < input.length; i++)
  {
    if(input[i] == '(') readingSymbols = true;
    if((input[i] == '*') && readingSymbols) return false;
    if(input[i] == 'x')
    {
      if(!readingSymbols) return false;
      if(input[i + 1] in foundArguments) return false;
      foundArguments[input[i + 1]] = 1;
      distinctArgumentsInCurrentParenthesesSet++;
    }
    if(input[i] == ')') 
    {
      if(i < input.length - 1 && input[i + 2] != '*') return false;
      if(distinctArgumentsInCurrentParenthesesSet != argumentsQuantity) return false;
      distinctArgumentsInCurrentParenthesesSet = 0;
      foundArguments = {};
      readingSymbols = false;
    }
  }
  return true;
}

function isSDNF(input, argumentsQuantity)
{
  var allowedCharacters = 
  {
    "x": 1,
    "(": 1,
    ")": 1,
    "!": 1,
    "+": 1,
    "*": 1,
    " ": 1
  }
  var argumentNumbers = quantityToSet(argumentsQuantity);
  for(let i = 0; i < input.length; i++)
  {
    if(!(input[i] in allowedCharacters || input[i] in argumentNumbers)) return false;
  }
  var distinctArgumentsInCurrentParenthesesSet = 0;
  var readingSymbols = false;
  var foundArguments = {};
  for(let i = 0; i < input.length; i++)
  {
    if(input[i] == '(') readingSymbols = true;
    if((input[i] == '+') && readingSymbols) return false;
    if(input[i] == 'x')
    {
      if(!readingSymbols) return false;
      if(input[i + 1] in foundArguments) return false;
      foundArguments[input[i + 1]] = 1;
      distinctArgumentsInCurrentParenthesesSet++;
    }
    if(input[i] == ')') 
    {
      if(i < input.length - 1 && input[i + 2] != '+') return false;
      if(distinctArgumentsInCurrentParenthesesSet != argumentsQuantity) return false;
      distinctArgumentsInCurrentParenthesesSet = 0;
      foundArguments = {};
      readingSymbols = false;
    }
  }
  return true;
}

function checkInputCorrectness(input)
{
  var argumentQuantity = input.split('').reduce((r, v) => { if(!isNaN(v) && Number(v) > r) return Number(v); else return r }, 0);
  return isSDNF(input, argumentQuantity) || isSKNF(input, argumentQuantity);
}

function bothSumOrProduct(leftImplicant, rightImplicant)
{
  var connector;
  for(let i = 0; i < leftImplicant.length; i++)
  {
    if(leftImplicant[i] == ' ')
    {
      connector = leftImplicant[i + 1];
      break;
    }
  }
  for(let i = 3; i < leftImplicant.length; i++)
  {
    if(leftImplicant[i] == 'x')
    {
      if(leftImplicant[i - 1] == '!')
      {
        if(leftImplicant[i - 3] != connector) return false;
      }
      else if(leftImplicant[i - 2] != connector) return false;
    }
  }
  for(let i = 3; i < rightImplicant.length; i++)
  {
    if(rightImplicant[i] == 'x')
    {
      if(rightImplicant[i - 1] == '!')
      {
        if(rightImplicant[i - 3] != connector) return false;
      }
      else if(rightImplicant[i - 2] != connector) return false;
    }
  }
  return true;
}

function areNeighboring(leftImplicant, rightImplicant)
{
  if(!bothSumOrProduct(leftImplicant, rightImplicant)) return false;
  var leftNegatedArguments = getNegatedArguments(leftImplicant); 
  var rightNegatedArguments = getNegatedArguments(rightImplicant);
  if(Object.keys(leftNegatedArguments).length != Object.keys(rightNegatedArguments).length) return false;
  for(let key in leftNegatedArguments)
  {
    if(!(key in rightNegatedArguments)) return false;
  }
    for(let key in rightNegatedArguments)
  {
    if(!(key in leftNegatedArguments)) return false;
  }
  var differentNegations = 0;
  for(let key in leftNegatedArguments)
  {
    if(leftNegatedArguments[key] != rightNegatedArguments[key]) differentNegations++;
  }
  if(differentNegations == 1) return true;
  else return false;
}

function subfunctionOf(func, subfunc)
{
  if(!bothSumOrProduct(func, subfunc)) return false;
  var funcNegatedArguments = getNegatedArguments(func);
  var subfuncNegatedArguments = getNegatedArguments(subfunc);
  if(Object.keys(subfunc).length > Object.keys(func).length) return false;
  for(let key in subfuncNegatedArguments)
  {
    if(!(key in funcNegatedArguments)) return false;
    if(subfuncNegatedArguments[key] != funcNegatedArguments[key]) return false;
  }
  return true;
}

function concatenateNeighboring(left, right)
{
  var leftNegatedArguments = getNegatedArguments(left);
  var rightNegatedArguments = getNegatedArguments(right);
  var connector;
  for(var i = 0; i < left.length; i++)
  {
    if(left[i] == ' ')
    {
      connector = left[i + 1];
      break;
    }
  }
  var resultStr = "";
  for(let key in leftNegatedArguments)
  {
    if(leftNegatedArguments[key] != rightNegatedArguments[key]) continue;
    else
    {
      if(leftNegatedArguments[key]) resultStr += '!';
      resultStr += 'x' + key + ' ' + connector + ' ';
    }
  }
  return resultStr.slice(0, resultStr.length - 3);
}

function concatenateAllNeighboring(input)
{
  if(input.indexOf(')') == input.length - 1) return input;
  var implicantConnector = ' ' + input[input.indexOf(')') + 2] + ' ';
  var implicantsArray = input.split(implicantConnector);
  var concatenatedImplicants = new Array(implicantsArray.length).fill(false);
  var currLeftImplicant, currRightImplicant;
  var resultStr = "";
  for(var leftIndex = 0; leftIndex < implicantsArray.length; leftIndex++)
  {
    if(concatenatedImplicants[leftIndex]) continue;
    currLeftImplicant = clearParentheses(implicantsArray[leftIndex]);
    for(var rightIndex = leftIndex + 1; rightIndex < implicantsArray.length; rightIndex++)
    {
      if(concatenatedImplicants[rightIndex]) continue;
      currRightImplicant = clearParentheses(implicantsArray[rightIndex]);
      if(areNeighboring(currLeftImplicant, currRightImplicant)) 
      {
        resultStr += '(' + concatenateNeighboring(currLeftImplicant, currRightImplicant) + ')' + implicantConnector;
        concatenatedImplicants[leftIndex] = true;
        concatenatedImplicants[rightIndex] = true;
      }
    }
  }
  for(var i = 0; i < concatenatedImplicants.length; i++)
  {
    if(!concatenatedImplicants[i])
    {
      resultStr += implicantsArray[i] + implicantConnector;
    }
  }
  return resultStr.slice(0, resultStr.length - 3);
}

function consumeAllSubfunctionsIn(input)
{
  if(input.indexOf(')') == input.length - 1) return input;
  var implicantConnector = ' ' + input[input.indexOf(')') + 2] + ' ';
  var changeMade;
  var resultStr = input;
  do
  {
    changeMade = false;
    var implicantsArray = resultStr.split(implicantConnector);
    var resultSet = {};
    var consumed = new Array(implicantsArray.length).fill(false);
    if(implicantsArray.length != 1)
    {    
      var currLeftImplicant, currRightImplicant;
      for(var leftIndex = 0; leftIndex < implicantsArray.length; leftIndex++)
      {
        currLeftImplicant = clearParentheses(implicantsArray[leftIndex]);
        if(changeMade && !consumed[leftIndex])
        {
          resultSet[currLeftImplicant] = 1;
          continue;
        }
        for(var rightIndex = 0; rightIndex < implicantsArray.length; rightIndex++)
        {
          if(leftIndex == rightIndex) continue;
          currRightImplicant = clearParentheses(implicantsArray[rightIndex]);
          if(changeMade && !consumed[rightIndex])
          {
            resultSet[currRightImplicant] = 1;
            continue;
          }
          if(subfunctionOf(currLeftImplicant, currRightImplicant)) 
          {
            resultSet[currRightImplicant] = 1;
            consumed[leftIndex] = true;
            changeMade = true;
          }
          if(subfunctionOf(currRightImplicant, currLeftImplicant))
          {
            resultSet[currLeftImplicant] = 1;
            consumed[rightIndex] = true;
            changeMade = true;
          }
        }
      }
    }
    if(!changeMade)
    {
      resultSet = {};
      for(var i = 0; i < implicantsArray.length; i++) resultSet[clearParentheses(implicantsArray[i])] = 1;
    }
    resultStr = "";
    for(let key in resultSet) resultStr += '(' + key + ')' + implicantConnector;
    resultStr = resultStr.slice(0, resultStr.length - 3);
  }
  while(changeMade);
  return resultStr;
}

function stage1(input)
{
  var result = input;
  var prevResult;
  do
  {
    prevResult = result;
    result = concatenateAllNeighboring(result);
    result = consumeAllSubfunctionsIn(result);
  }
  while(prevResult != result);
  return result;
}

function getRequiredArgumentValues(implicant)
{
  var disjunctiveImplicant = (implicant[implicant.indexOf(' ') + 1] == '+') ? true : false;
  var implicantArray = implicant.split('');
  var argumentValues = {};
  implicantArray.forEach((v, i, a) => 
  {  
    if(v == 'x')
    {
      if(disjunctiveImplicant) argumentValues[a[i + 1]] = (a[i - 1] == '!')
      else argumentValues[a[i + 1]] = (a[i - 1] != '!')
    }
  })
  return argumentValues;
}

function replaceArgumentsWithValues(input, argumentValues)
{
  for(let key in argumentValues)
  {
    input = input.split('x' + key);
    if(argumentValues[key]) input = input.join('1');
    else input = input.join('0'); 
  }
  input = input.split("!0").join('1');
  input = input.split("!1").join('0');
  return input;
}

function evaluateWithReplacedValues(input)
{
  var implicantConnector = ' ' + input[input.indexOf(')') + 2] + ' ';
  var implicantArray = input.split(implicantConnector);
  implicantArray.forEach((v, i, a) => 
  {
    if(v[v.indexOf(' ') + 1] == '+')
    {
      if(v.indexOf('1') == -1)
      {
        var argumentIndex = v.indexOf('x');
        if(argumentIndex == -1) a[i] = '0';
        else
        {
          var negatedArgument = (v[argumentIndex - 1] == '!');
          if(negatedArgument) a[i] = v.slice(argumentIndex - 1, argumentIndex + 2);
          else a[i] = v.slice(argumentIndex, argumentIndex + 2);
        }
      }
      else a[i] = '1';
    }
    else
    {
      if(v.indexOf('0') == -1)
      {
        var argumentIndex = v.indexOf('x');
        if(argumentIndex == -1) a[i] = '1';
        else
        {
          var negatedArgument = (v[argumentIndex - 1] == '!');
          if(negatedArgument) a[i] = v.slice(argumentIndex - 1, argumentIndex + 2);
          else a[i] = v.slice(argumentIndex, argumentIndex + 2);
        }
      }
      else a[i] = '0';
    }
  })
  for(let i = 0; i < implicantArray.length; i++)
  {
    var currLeft = implicantArray[i];
    for(let j = i + 1; j < implicantArray.length; j++)
    {
      var currRight = implicantArray[j];
      if(implicantArray[i].indexOf('x') != -1 && implicantArray[j].indexOf('x') != -1)
      {
        var currLeftLength = currLeft.length;
        var currRightLength = currRight.length;
        if(Math.abs(currLeftLength - currRightLength) == 1 && (currLeft[currLeftLength - 1] == currRight[currRightLength - 1]))
        {
          var newArray = implicantArray.filter((v, ind) => (ind != i && ind != j));
          if(implicantConnector == ' + ') newArray.push('1');
          else newArray.push('0');
          implicantArray = newArray;
        }
      }
    }
  }
  input = implicantArray.join(implicantConnector);
  if(implicantConnector == ' + ')
  {
    if(input.indexOf('1') != -1) return "1";
    else
    {
      if(input.indexOf('x') != -1) return "x";
      else return "0";
    }
  }
  else
  {
    if(input.indexOf('0') != -1) return "0";
    else
    {
      if(input.indexOf('x') != -1) return "x";
      else return "1";
    }
  }
}

function checkImplicantImportance(func, implicant)
{
  var lockedArguments = getRequiredArgumentValues(implicant);
  func = replaceArgumentsWithValues(func, lockedArguments);
  if(evaluateWithReplacedValues(func) == 'x') return true;
  else return false;
}

function reduceViaCalculatingMethod(input)
{
  if(checkInputCorrectness(input) == false) return "Incorrect input";
  var stage1output = stage1(input);
  var implicantConnector = ' ' + input[input.indexOf(')') + 2] + ' ';
  var implicantArray = stage1output.split(implicantConnector);
  if(implicantArray.length == 1) return stage1output;
  var redundantImplicants = new Array(implicantArray.length).fill(false);
  for(let i = 0; i < implicantArray.length; i++)
  {
    if(redundantImplicants.filter(v => v == true).length == implicantArray.length - 1) break;
    redundantImplicants[i] = !checkImplicantImportance(implicantArray.filter(v => v != implicantArray[i]).join(implicantConnector), implicantArray[i]);
  }
  return implicantArray.filter((v, i) => redundantImplicants[i] == false).join(implicantConnector);
}

function redundantRow(matrix, rowIndex, ignoredRows)
{
  var trueInCurrentColumn;
  for(var j = 0; j < matrix[0].length; j++)
  {
    trueInCurrentColumn = 0;
    for(var i = 0; i < matrix.length; i++)
    {
      if(i == rowIndex || ignoredRows.some((v) => (v == i))) continue;
      if(matrix[i][j]) trueInCurrentColumn++;
    }
    if(trueInCurrentColumn != 1) return false;
  }
  ignoredRows.push(rowIndex);
  return true;
}

function reduceViaTableCalculatingMethod(input)
{
  if(checkInputCorrectness(input) == false) return "Incorrect input";
  var implicantConnector = ' ' + input[input.indexOf(')') + 2] + ' ';
  var stage1output = stage1(input);
  var constituentArray = input.split(implicantConnector);
  constituentArray.forEach((v, i, a) => { a[i] = clearParentheses(v) });
  var implicantArray = stage1output.split(implicantConnector);
  implicantArray.forEach((v, i, a) => { a[i] = clearParentheses(v) });
  var matrix = new Array(implicantArray.length);
  for(let i = 0; i < matrix.length; i++)
  {
    matrix[i] = new Array(constituentArray.length);
    for(let j = 0; j < constituentArray.length; j++)
    {
      matrix[i][j] = subfunctionOf(constituentArray[j], implicantArray[i]);
    }
  }
  var ignoredRows = [];
  var redundantRows = matrix.map((v, i) => redundantRow(matrix, i, ignoredRows));
  var resultStr = "";
  redundantRows.forEach((v, i) => { if(!v) resultStr += '(' + implicantArray[i] + ')' +  implicantConnector });
  return resultStr.slice(0, resultStr.length - 3);
}

function intToBinaryArr(num, places)
{
  var binaryArr = new Array(places).fill(0);
  for(let i = 0; i < places; i++)
  {
    binaryArr.shift();
    binaryArr.push(num % 2);
    num = Math.floor(num / 2);
  }
  return binaryArr.reverse();
}

function binaryArrToInt(arr)
{
  var result = 0;
  arr.forEach((v, i, a) => { result += v * Math.pow(2, a.length - 1 - i) });
  return result;
}

function intToGreyArr(num, places)
{
  var arr = intToBinaryArr(num, places);
  var shiftedArr = arr.map((v) => v);
  shiftedArr.unshift(0);
  shiftedArr.pop();
  var greyArr = new Array(arr.length);
  for(let i = 0; i < arr.length; i++) greyArr[i] = (arr[i] ^ shiftedArr[i]);
  return greyArr;
}

function getMaxArgumentIndex(input)
{
  return input.split('').reduce((r, v) => { if(!isNaN(v) && Number(v) > r) return Number(v); else return r }, 0);
}

function getTruthTable(input)
{
  var argumentQuantity = getMaxArgumentIndex(input);
  var truthTable = new Array(argumentQuantity + 1).fill(0);
  truthTable.forEach((v, i, a) => { a[i] = new Array(Math.pow(2, argumentQuantity)); });
  for(let j = 0; j < Math.pow(2, argumentQuantity); j++)
  {
    var currArgumentArray = intToBinaryArr(j, argumentQuantity);
    for(let i = 0; i < argumentQuantity; i++)
    {
      truthTable[i][j] = currArgumentArray[i];
    }
  }
  var truthTableBottomRow = [];
  for(let i = 0; i < Math.pow(2, argumentQuantity); i++)
  {
    var currArgumentArray = intToBinaryArr(i, argumentQuantity);
    var currArgumentSet = {};
    currArgumentArray.forEach((v, i) => currArgumentSet[String(i + 1)] = v);
    truthTableBottomRow[i] = Number(evaluateWithReplacedValues(replaceArgumentsWithValues(input, currArgumentSet)));
  }
  truthTable[argumentQuantity] = truthTableBottomRow;
  return truthTable;
}

function union(set1, set2)
{
  var result = {};
  for(let i in set1) result[i] = set1[i];
  for(let i in set2) result[i] = set2[i];
  return result;
}

function greyArrToArgumentValues(greyArr, oddArgs)
{
  var argValuesSet = {};
  greyArr.forEach((v, i, a) => { argValuesSet[String(2 * (i + 1) - oddArgs)] = (a[i] == 1); });
  return argValuesSet;
}

function getCarnaughMap(func)
{
  var argumentQuantity = getMaxArgumentIndex(func);
  var argumentQuantityDummy = argumentQuantity;
  var argumentsInColumns = 0, argumentsInRows = 0;
  while(argumentQuantityDummy > 0)
  {
    argumentsInColumns++;
    argumentQuantityDummy--;
    if(argumentQuantityDummy > 0)
    {
      argumentsInRows++;
      argumentQuantityDummy--;
    }
  }
  var width = Math.pow(2, argumentsInColumns);
  var height = Math.pow(2, argumentsInRows);
  var columns = new Array(width).fill(0);
  columns.forEach((v, i, a) => { a[i] = greyArrToArgumentValues(intToGreyArr(i, argumentsInColumns), true) });
  var rows = new Array(height).fill(0);
  rows.forEach((v, i, a) => { a[i] = greyArrToArgumentValues(intToGreyArr(i, argumentsInRows), false) });
  var carnaughMap = new Array(height).fill(0);
  carnaughMap.forEach((v, i, a) => 
  { 
    a[i] = new Array(width).fill(0);
    a[i].forEach((v1, j) => { a[i][j] = Number(evaluateWithReplacedValues(replaceArgumentsWithValues(func, union(columns[j], rows[i])))); });
  });
  return { "map": carnaughMap, "rows": rows, "columns": columns };
}

function allOnesInGroup(map, upperLeftBound, lowerRightBound)
{
  var firstIIteration = true;
  for(var i = upperLeftBound[0]; i != (lowerRightBound[0] + 1) % map.length || firstIIteration; i = (i + 1) % map.length)
  {
    firstIIteration = false;
    var firstJIteration = true;
    for(var j = upperLeftBound[1]; j != (lowerRightBound[1] + 1) % map[0].length || firstJIteration; j = (j + 1) % map[0].length)
    {
      firstJIteration = false;
      if(map[i][j] != 1) return false;
    }
  }
  return true;
}

function findAllGroupsOfOnesOfSizePowerTwo(map)
{
  var valuesToAdd_Row = [0];
  var currValueToAdd = 1;
  while(currValueToAdd < map[0].length)
  {
    valuesToAdd_Row.push(currValueToAdd);
    currValueToAdd *= 2;
  }
  var valuesToAdd_Column = [0];
  currValueToAdd = 1;
  while(currValueToAdd < map.length)
  {
    valuesToAdd_Column.push(currValueToAdd);
    currValueToAdd *= 2;
  }
  var groups = [];
  var currGroup = [];
  for(let i = 0; i < map.length; i++)
  {
    for(let j = 0; j < map[0].length; j++)
    {
      if(map[i][j] == 1)
      {
        var currUpperLeftBound = [i, j];
        var currExtraWidth = 0;
        var currExtraHeight = 0;
        for(let widthStep of valuesToAdd_Row)
        {
          currExtraWidth += widthStep;
          for(let heightStep of valuesToAdd_Column)
          {
            currExtraHeight += heightStep;
            var currLowerRightBound = [(i + currExtraHeight) % map.length, (j + currExtraWidth) % map[0].length];
            if(allOnesInGroup(map, [i, j], currLowerRightBound)) groups.push([[i, j], currLowerRightBound]);
          }
          currExtraHeight = 0;
        }
      }
    }
  }
  return groups;
}

function findBestGroupCoverage(map)
{
  var coverages = [];
  var groups = findAllGroupsOfOnesOfSizePowerTwo(map);
  for(let i = 1; i <= 5; i++) coverages.push(findAllCoveragesWithNGroups(map, groups, i));
  var maxCoverageCoefficient = 0;
  var bestCoverageGroupQuantity;
  var bestCoverageIndex;
  var currBestCoverageCoefficient;
  var currBestCoverageIndex = 0;
  for(let i = 0; i < 5; i++)
  {
    if(coverages[i].length == 0) continue;
    currBestCoverageCoefficient = coverages[i].reduce(((r, v, ind) => 
    {
      var currCoefficient = calcCoverageCoefficient(v, map);
      if(r < currCoefficient)
      {
        currBestCoverageIndex = ind;
        return currCoefficient;
      }
      else return r;
    }), 0);
    if(currBestCoverageCoefficient > maxCoverageCoefficient)
    {
      maxCoverageCoefficient = currBestCoverageCoefficient;
      bestCoverageGroupQuantity = i;
      bestCoverageIndex = currBestCoverageIndex;
    }
  }
  return coverages[bestCoverageGroupQuantity][bestCoverageIndex];
}

function findAllCoveragesWithNGroups(map, groups, n)
{
  if(groups.length < n) return [];
  var coverages = [];
  var currCoverage = [];
  var currCoverageElementIndeces = [];
  for(let i = 0; i < n; i++) 
  {
    currCoverage.push(groups[i]);
    currCoverageElementIndeces.push(i);
  }
  if(coversAllOnes(map, currCoverage)) coverages.push(currCoverage);
  while(!currCoverageElementIndeces.every((v, i) => v == groups.length - (n - i)))
  {
    var currIndexToIncrease = n - 1;
    while(currCoverageElementIndeces[currIndexToIncrease] == groups.length - (n - currIndexToIncrease)) currIndexToIncrease--;
    currCoverageElementIndeces[currIndexToIncrease]++;
    for(let i = currIndexToIncrease + 1; i < n; i++) currCoverageElementIndeces[i] = currCoverageElementIndeces[i - 1] + 1;
    currCoverage = currCoverageElementIndeces.map((v) => groups[v]);
    if(coversAllOnes(map, currCoverage)) coverages.push(currCoverage);
  }
  return coverages;
}

function coversAllOnes(map, groups)
{
  for(let i = 0; i < map.length; i++)
  {
    for(let j = 0; j < map[0].length; j++)
    {
      if(map[i][j] == 1)
      {
        if(!groups.some((v) => 
        {
          var upperLeftIIndex = v[0][0];
          var lowerRightIIndex = v[1][0];
          var currIFound = (upperLeftIIndex == i);
          while(!currIFound && upperLeftIIndex != lowerRightIIndex) 
          {
            upperLeftIIndex = (upperLeftIIndex + 1) % map.length;
            if(upperLeftIIndex == i) currIFound = true;
          }
          var upperLeftJIndex = v[0][1];
          var lowerRightJIndex = v[1][1];
          var currJFound = (upperLeftJIndex == j);
          while(!currJFound && upperLeftJIndex != lowerRightJIndex) 
          {
            upperLeftJIndex = (upperLeftJIndex + 1) % map[0].length;
            if(upperLeftJIndex == j) currJFound = true;
          }
          return currIFound && currJFound;
        })) return false;
      }
    }
  }
  return true;
}

function onesInMap(map)
{
  var quantity = 0;
  for(let i = 0; i < map.length; i++)
  {
    for(let j = 0; j < map[0].length; j++)
    {
      if(map[i][j] == 1) quantity++;
    }
  }
  return quantity;
}

function calcCoverageCoefficient(groups, map)
{
  if(groups.length == 0) return 0;
  var combinedGroupSize = groups.reduce(((r, v) => r += calcGroupSize(v, map[0].length, map.length)), 0);
  return onesInMap(map) / (groups.length * combinedGroupSize);
}

function calcGroupSize(group, mapWidth, mapHeight)
{
  var width = 1;
  var upperLeftJIndex = group[0][1];
  var lowerRightJIndex = group[1][1];
  while(upperLeftJIndex != lowerRightJIndex)
  {
    upperLeftJIndex = (upperLeftJIndex + 1) % mapWidth;
    width++;
  }
  var height = 1;
  var upperLeftIIndex = group[0][0];
  var lowerRightIIndex = group[1][0];
  while(upperLeftIIndex != lowerRightIIndex)
  {
    upperLeftIIndex = (upperLeftIIndex + 1) % mapHeight;
    height++;
  }
  return width * height;
}

function checkArgumentConstancy(mapInfo, group)
{
  var rowArgumentUnchangedValues = {};
  var rows = mapInfo.rows;
  var columns = mapInfo.columns;
  var mapWidth = mapInfo.map[0].length;
  var mapHeight = mapInfo.map.length;
  for(let key in rows[group[0][0]]) rowArgumentUnchangedValues[key] = true;
  var columnArgumentUnchangedValues = {};
  for(let key in columns[group[0][1]]) columnArgumentUnchangedValues[key] = true;
  for(let i = group[0][0]; i != (group[1][0] + 1) % mapHeight/* || firstIIteration*/; i = (i + 1) % mapHeight)
  {
    for(let key in rows[i]) if(rows[group[0][0]][key] != rows[i][key]) rowArgumentUnchangedValues[key] = false;
    for(let j = group[0][1]; j != (group[1][1] + 1) % mapWidth/* || firstJIteration*/; j = (j + 1) % mapWidth)
    {
      for(let key in columns[j]) if(columns[group[0][1]][key] != columns[j][key]) columnArgumentUnchangedValues[key] = false;
      if(group[0][1] == group[1][1]) break;
    }
    if(group[0][0] == group[1][0]) break;
  }
  return [rowArgumentUnchangedValues, columnArgumentUnchangedValues];
}

function reduceViaTableMethod(input)
{
  if(checkInputCorrectness(input) == false) return "Incorrect input";
  var mapInfo = getCarnaughMap(input);
  for(let i of mapInfo.map) console.log(i);
  var bestCoverage = findBestGroupCoverage(mapInfo.map);
  var unchangedValues = [{}, {}];
  var result = "";
  var currImplicant;
  for(let group of bestCoverage)
  {
    var currResult = checkArgumentConstancy(mapInfo, group);
    var currArgumentConstancy = union(currResult[0], currResult[1]);
    currImplicant = "(";
    for(let arg in currArgumentConstancy)
    {
      if(currArgumentConstancy[arg] == true)
      {
        var currArgNegated;
        if(Number(arg) % 2 == 0) currArgNegated = !mapInfo.rows[group[0][0]][arg];
        else currArgNegated = !mapInfo.columns[group[0][1]][arg];
        if(currArgNegated) currImplicant += '!';
        currImplicant += 'x' + arg + ' * ';
      }
    }
    currImplicant = currImplicant.slice(0, currImplicant.length - 3) + ')';
    if(currImplicant != ')') result += currImplicant + " + ";
  }
  return stage1(result.slice(0, result.length - 3));
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

async function lab3()
{          
  var argumentQuantity = 0;
  var firstIteration = true;
  do
  {
    if(!firstIteration) console.log("Incorrect input. ")
    argumentQuantity = Number(await readlinePromise("Input argument quantity: "));
    firstIteration = false;
  }
  while(isNaN(argumentQuantity) || argumentQuantity % 1 != 0 || argumentQuantity < 1);

  var func = "";
  firstIteration = true;
  do
  {
    if(!firstIteration) console.log("Incorrect input. ")
    func = await readlinePromise("Input the function to minimize: ");
    firstIteration = false;
  }
  while(!isSDNF(func, argumentQuantity) && !isSKNF(func, argumentQuantity));

  var method = 0;
  firstIteration = true;
  do
  {
    if(!firstIteration) console.log("Incorrect input. ")
    method = Number(await readlinePromise("Choose minimization method: 1 - calculating, 2 - table-calculating, 3 - table: "));
    firstIteration = false;
  }
  while(isNaN(method) || method % 1 != 0 || method < 1 || method > 3);

  switch(method)
  {
  case 1:
  {
    console.log(reduceViaCalculatingMethod(func));
    break;
  }
  case 2:
  { 
    console.log(reduceViaTableCalculatingMethod(func));
    break;
  }
  case 3:
  {
    console.log(reduceViaTableMethod(func));
    break;
  }
  default:
  {
    console.log("Something went wrong!");
  }
  }
}

module.exports =
{
  lab: lab3,
  minimize: reduceViaTableCalculatingMethod
}