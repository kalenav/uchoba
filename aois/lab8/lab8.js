const matrix_size = 16;

function new_associative_matrix()
{
  var matrix = new Array(matrix_size);
  for(let i = 0; i < matrix_size; i++) matrix[i] = (new Array(matrix_size)).fill(0);
  return matrix;
}

function copy_matrix(matrix)
{
  var copy = new Array(matrix.length);
  for(let i = 0; i < matrix.length; i++) copy[i] = new Array(matrix[0].length);
  for(let i = 0; i < matrix.length; i++) for(let j = 0; j < matrix[0].length; j++) copy[i][j] = matrix[i][j];
  return copy;
}

function shift_existing_entries_left(matrix)
{
  var copy = copy_matrix(matrix);
  for(let i = 0; i < matrix.length; i++)
  {
    for(let j = 0; j < matrix[0].length; j++)
    {
      matrix[i][(j + matrix_size - 1) % matrix_size] = copy[i][j];
    }
  }
  return matrix;
}

function add_entry(matrix, entry)
{
  if(!(entry instanceof Array) || entry.some(v => typeof(v) != 'boolean') || entry.length != matrix_size) return false;
  shift_existing_entries_left(matrix);
  for(let i = 0; i < matrix_size; i++)
  {
    matrix[i][i] = Number(entry[i]);
  }
  return true;
}

function matrix_to_buffer(matrix)
{
  var buffer = [];
  for(let i = 0; i < matrix_size; i++)
  {
    if(matrix[i][0] == -1) break;
    var row = i;
    var column = 0;
    var curr_diagonal = [];
    do
    {
      curr_diagonal.push(matrix[row][column]);
      row = (row + 1) % matrix_size;
      column++;
    }
    while(row != i)
    buffer.push(curr_diagonal);
  }
  return buffer;
}

function buffer_to_matrix(buffer)
{
  var matrix = new_associative_matrix();
  for(let arr of buffer) add_entry(matrix, arr);
  return matrix;
}

function binary_addition(number1, number2, places)
{
  if(number1.length != number2.length)
  {
    var extending = (number1.length > number2.length) ? number2 : number1;
    var keeping = (extending == number1) ? number2 : number1;
    while(extending.length < keeping.length) extending.unshift(0);
  }
  var carrying = 0;
  var result = [];
  for(let i = number1.length - 1; i >= 0; i--)
  {
    var curr_sum = number1[i] + number2[i] + carrying;
    result.unshift(curr_sum % 2);
    if(curr_sum >= 2) carrying = 1;
    else carrying = 0;
  }
  while(result.length < places) result.unshift(0);
  while(result.length > places) result.shift();
  return result;
}

function add_two_matrix_entries(matrix, index1, index2)
{
  var buffer = matrix_to_buffer(matrix);
  var index1_out_of_bounds = index1 > buffer.length - 1;
  var index2_out_of_bounds = index2 > buffer.length - 1;
  if(index1_out_of_bounds && index2_out_of_bounds) return binary_addition([0], [0], matrix_size);
  if(index1_out_of_bounds) return binary_addition(buffer[index2], [0], 16);
  if(index2_out_of_bounds) return binary_addition(buffer[index1], [0], 16)
  return binary_addition(buffer[index1], buffer[index2], 16);
}

function random_matrix()
{
  var matrix = new_associative_matrix();
  for(let i = 0; i < matrix_size; i++)
  {
    var curr_entry = [];
    for(let j = 0; j < matrix_size; j++)
    {
      curr_entry.push(Boolean(Math.round(Math.random())));
    }
    add_entry(matrix, curr_entry);
  }
  return matrix;
}

function print_matrix(matrix)
{
  for(let i = 0; i < matrix.length; i++)
  {
    var curr_line = "";
    for(let j = 0; j < matrix[0].length; j++)
    {
      curr_line += matrix[i][j] + ' ';
    }
    console.log(curr_line);
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

async function lab8()
{
  var first_iteration = true;
  var choice;
  do
  {
    if(!first_iteration) console.log("Incorrect input.");
    first_iteration = false;
    choice = Number(await readlinePromise("1 - randomize matrix, 2 - input by hand: "));
  }    
  while(isNaN(choice) || choice % 1 != 0 || choice < 1 || choice > 2);
  var matrix;
  if(choice == 1)
  {
    matrix = random_matrix();
  }
  else
  {
    matrix = new_associative_matrix();
  }
 
  var allowed_characters = 
  {
    '1': 1,
    '0': 1,
    ' ': 1
  }
  var lastInputIncorrect = false;
  while(true)
  {
    if(lastInputIncorrect) console.log("Incorrect input.")
    lastInputIncorrect = false;
    choice = Number(await readlinePromise("1 - view matrix\n2 - add entry\n3 - sum of two entries\n4 - exit\n"));
    if(isNaN(choice) || choice % 1 != 0 || choice < 1 || choice > 4)
    {
      lastInputIncorrect = true;
      continue;
    }
    switch(choice)
    {
    case 1:
    {
      print_matrix(matrix);
      break;
    }
    case 2:
    {
      var input = await readlinePromise("Input your entry: 1 for true, 0 for false, length 16 (e.g. 1 1 0 0 1 0 1 0 0 0 1 1 0 0 0 1) ");
      if(input.split('').some(v => !(v in allowed_characters)))
      {
        lastInputIncorrect = true;
        break;
      }
      var entry = input.split(' ').map(v => Boolean(Number(v)));
      if(!add_entry(matrix, entry)) console.log("Incorrect input or matrix is full; no changes made");
      break;
    }
    case 3:
    {
      var index1;
      first_iteration = true;
      do
      {
        if(!first_iteration) console.log("Incorrect input.");
        first_iteration = false;
        index1 = Number(await readlinePromise("Input the index of the first entry: "));
      }   
      while(isNaN(index1) || index1 % 1 != 0 || index1 < 0 || index1 > matrix_size - 1);
      var index2;
      first_iteration = true;
      do
      {
        if(!first_iteration) console.log("Incorrect input.");
        first_iteration = false;
        index2 = Number(await readlinePromise("Input the index of the second entry: "));
      }   
      while(isNaN(index2) || index2 % 1 != 0 || index2 < 0 || index2 > matrix_size - 1);
      console.log(add_two_matrix_entries(matrix, index1, index2));
      break;
    }
    case 4: return;
    }
  }
}

lab8();