function HashTable(size, element_length)
{
  var table = new Array(size);
  for(let i = 0; i < size; i++) table[i] = [];
  this.table = table;
  this.length = size;
  this.width = element_length;
  return this;
}

function create_hash_table(size, element_length)
{
  return new HashTable(size, element_length);
}

function add_entry(hash_table, pushing)
{
  if(!(pushing instanceof Array) || pushing.length != hash_table.width || !pushing.every(v => typeof(v) == 'boolean')) return false;
  for(let curr_arr = hash_table.length - 1; curr_arr >= 0; curr_arr--)
  {
    if(curr_arr == 0 || hash_table.table[curr_arr].length < hash_table.table[curr_arr - 1].length)
    {
      hash_table.table[curr_arr].push(pushing);
      return true;
    }
  }
}

function check_array_and_mask_equality(array, mask, ignoring)
{
  for(let i = 0; i < array.length - ignoring; i++)
  {
    if(array[i] != mask[i]) return false;
  }
  return true;
}

function get_matching_element_quantity(array, mask, ignoring)
{
  var matching = 0;
  for(let i = 0; i < array.length - ignoring; i++)
  {
    if(array[i] == mask[i]) matching++;
  }
  return matching;
}

function search_for_entry(hash_table, mask, ignoring)
{
  for(let curr_arr of hash_table.table)
  {
    for(let curr_element of curr_arr)
    {
      if(check_array_and_mask_equality(curr_element, mask, ignoring)) return curr_element;
    }
  }
  var hash_table_elements_matching_characters_quantities = [];
  for(let i = 0; i < hash_table.length; i++)
  {
    for(let j = 0; j < hash_table.table[i].length; j++)
    {
      hash_table_elements_matching_characters_quantities.push([get_matching_element_quantity(hash_table.table[i][j], mask, ignoring), hash_table.table[i][j]]);
    }
  }
  var max_matching_characters = hash_table_elements_matching_characters_quantities.reduce(((r, v) => r > v[0] ? r : v[0]), 0);
  var search_result = hash_table_elements_matching_characters_quantities.filter(v => v[0] == max_matching_characters);
  return search_result;
}

function create_random_hash_table(size, element_length, elements_to_add)
{
  var table = new HashTable(size, element_length);
  while(elements_to_add > 0)
  {
    var new_element = [];
    for(let i = 0; i < table.width; i++) new_element.push(Boolean(Math.round(Math.random())));
    add_entry(table, new_element);
    elements_to_add--;
  }
  return table;
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

async function lab7()
{
  var hash_table_size;
  var first_iteration = true;
  do
  {
    if(!first_iteration) console.log("Incorrect input. ");
    hash_table_size = Number(await readlinePromise("Input hash table size: "));
    first_iteration = false;
  }
  while(isNaN(hash_table_size) || hash_table_size % 1 != 0 || hash_table_size < 1);
  var hash_table_element_length;
  first_iteration = true;
  do
  {
    if(!first_iteration) console.log("Incorrect input.");
    hash_table_element_length = Number(await readlinePromise("Input hash table element length: "));
    first_iteration = false;
  }
  while(isNaN(hash_table_element_length) || hash_table_element_length % 1 != 0 || hash_table_element_length < 1);
  var hash_table_element_quantity;
  first_iteration = true;
  do
  {
    if(!first_iteration) console.log("Incorrect input.");
    hash_table_element_quantity = Number(await readlinePromise("How many elements will there be in your hash table? "));
    first_iteration = false;
  }
  while(isNaN(hash_table_element_quantity) || hash_table_element_quantity % 1 != 0 || hash_table_element_quantity < 1);
  var table = create_random_hash_table(hash_table_size, hash_table_element_length, hash_table_element_quantity);
  
  var allowed_input_characters =
  {
    '1': 1,
    '0': 1,
    ' ': 1
  }
  var lastInputIncorrect = false;
  while(true)
  { 
    if(lastInputIncorrect) console.log("Incorrect input. ");
    lastInputIncorrect = false;
    choice = Number(await readlinePromise("1 - add an element\n2 - search for an element\n3 - exit\n"));
    if(isNaN(choice) || choice % 1 != 0 || choice < 1 || choice > 3)
    {
      lastInputIncorrect = true;
      continue;
    }
    switch(choice)
    {
    case 3: return;
    case 1:
    {       
      var input = await readlinePromise("Input the element to add: 1 for true, 0 for false (e.g. 1 0 0 1 0 1) ");
      if(input.split('').some(v => !(v in allowed_input_characters)).length > 0)
      {
        lastInputIncorrect = true;
        break;
      }
      var element_to_add = input.split(' ').map(v => Boolean(Number(v)));
      if(!add_entry(table, element_to_add)) lastInputIncorrect = true;
      break;
    }
    case 2:
    {
      var input = await readlinePromise("Input the mask: 1 for true, 0 for false (e.g. 1 0 0 1 0 1) ");
      if(input.split('').some(v => !(v in allowed_input_characters)).length > 0)
      {
        lastInputIncorrect = true;
        break;
      }
      var mask = input.split(' ').map(v => Boolean(Number(v)));
      var ignoring = table.width - mask.length;
      console.log(search_for_entry(table, mask, ignoring));
      break;
    }
    }
  }
}

lab7();