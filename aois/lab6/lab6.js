var hashTable;
var hashTableSize;

function HashTableElement(key, val)
{
  this.key = key;
  this.value = val;
  this.next = null;
}

function allocHashTable(size)
{
  hashTable = new Array(size).fill(null);
  hashTableSize = size;
}

function getHashValue(input)
{
  return input.split('').reduce(((r, v, i) => r + input.charCodeAt(i) * Math.pow(27, input.length - 1 - i)), 0) % hashTableSize;
}

function addElementByKey(key, value)
{
  if(searchForElementByKey(key))
  {
    console.log("Such a key already exists in the hash table");
    return;
  }
  var keyValue = getHashValue(key);
  var newElement = new HashTableElement(key, value);
  if(hashTable[keyValue] != undefined)
  {
    for(let i = 0; i < hashTableSize; i++)
    {
      if(hashTable[i] == undefined)
      {
        hashTable[i] = newElement;
        return;
      }
    }
    newElement.next = hashTable[keyValue];
    hashTable[keyValue] = newElement;
  }
  else hashTable[keyValue] = newElement;
}

function searchForElementByKey(key)
{
  for(let i = 0; i < hashTable.length; i++)
  {
    var currElement = hashTable[i];
    if(currElement == undefined) continue;
    while(currElement != null)
    {
      if(currElement.key == key) return currElement.value;
      currElement = currElement.next;
    }
  }
  return undefined;
}

function deleteElementByKey(key)
{
  if(!searchForElementByKey(key))
  {
    console.log("There is no such key in the hash table");
    return;
  }
  var hashValue = getHashValue(key);
  var currElement = hashTable[hashValue];
  if(currElement != undefined)
  {
    if(currElement.key == key)
    {
      hashTable[hashValue] = currElement.next;
      delete currElement;
      return;
    }
    while(currElement.next != null && currElement.next.key != key) currElement = currElement.next;
    if(currElement.key == key)
    {
      hashTable[hashValue] = currElement.next;
      delete currElement;
      return;
    }
  }
  for(let i = 0; i < hashTable.length; i++)
  {
    if(i == hashValue) continue;
    currElement = hashTable[i];
    if(currElement == undefined) continue;
    if(currElement.key == key)
    {
      hashTable[i] = currElement.next;
      if(hashTable[i] != null) hashTable[i].first = true;
      delete currElement;
      return;
    }
    while(currElement.next != null && currElement.next.key != key) currElement = currElement.next;
    if(currElement.key == key)
    {
      hashTable[i] = currElement.next;
      if(hashTable[i] != null) hashTable[i].first = true;
      delete currElement;
      return;
    }
  }
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

async function lab6()
{
  var firstIteration = true;
  do
  {
    if(!firstIteration) console.log("Incorrect input. ");
    hashTableSize = Number(await readlinePromise("Input hash table size: "));
    firstIteration = false;
  }
  while(isNaN(hashTableSize) || hashTableSize % 1 != 0 || hashTableSize < 1)
  hashTable = new Array(hashTableSize);
  console.log("Hash table created.");
  var choice;
  var lastInputIncorrect = false;
  while(true)
  {
    if(lastInputIncorrect) console.log("Incorrect input. ");
    lastInputIncorrect = false;
    choice = Number(await readlinePromise("1 - add an element\n2 - search for an element\n3 - delete an element\n4 - exit\n"));
    if(isNaN(choice) || choice % 1 != 0 || choice < 1 || choice > 4)
    {
      lastInputIncorrect = true;
      continue;
    }
    if(choice == 4) break;
    var key;
    key = await readlinePromise("Input the key: ");
    switch(choice)
    {
      case 1:
      {
        var val;
        var firstIteration = true;
        do
        {
          if(!firstIteration) console.log("Incorrect input. ");
	  val = Number(await readlinePromise("Input the value: "));
	  firstIteration = false;
        }
        while(isNaN(val));
	addElementByKey(key, val);
        break;
      }
      case 2:
      {
	console.log(searchForElementByKey(key) || "There is no such key in the hash table\n");
        break;
      }
      case 3:
      {
	deleteElementByKey(key);
        break;
      }
    }
  }
}

lab6();