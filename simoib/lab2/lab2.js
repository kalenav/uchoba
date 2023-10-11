var vigenere_table = [];

for(let i = 0; i < 26; i++)
{
  var curr_row = [];
  for(let j = 0; j < 26; j++)
  {
    var curr_char_code = 97 + j + i;
    if(curr_char_code > 122) curr_char_code -= 26;
    curr_row.push(String.fromCharCode(curr_char_code));
  }
  vigenere_table.push(curr_row);
}

function vigenere_encode(plaintext, key)
{
    var result = "";
    for(let i = 0; i < plaintext.length; i++)
    {
        if(plaintext.charCodeAt(i) < 97 || plaintext.charCodeAt(i) > 122)
        {
            result += plaintext[i];
            continue;
        }
        result += vigenere_table[key.charCodeAt(i % key.length) - 97][plaintext.charCodeAt(i) - 97];
    }
    return result;
}

function vigenere_decode(message, key)
{
    var result = "";
    for(let i = 0; i < message.length; i++)
    {
        if(message.charCodeAt(i) < 97 || message.charCodeAt(i) > 122)
        {
            result += message[i];
            continue;
        }
        var char_code = message.charCodeAt(i) - key.charCodeAt(i % key.length);
        if(char_code < 0) char_code += 26;
        result += String.fromCharCode(char_code + 97);
    }
    return result;
}

function vigenere_bruteforce(message, plaintext, key_length)
{
    var key = new Array(key_length).fill(0);
    while(true)
    {
        var curr_key_string = key.map(v => String.fromCharCode(v + 97)).join('');
        if(vigenere_decode(message, curr_key_string) == plaintext)
        {
            return curr_key_string;
        }
        var curr_pos = key_length - 1;
        while(curr_pos > -1 && key[curr_pos] == 26) curr_pos--;
        if(curr_pos == -1) 
        {
            return "KEY NOT FOUND";
        }
        else
        {
            key[curr_pos]++;
            for(let i = curr_pos + 1; i < key_length; i++)
            {
                key[i] = 0;
            }
        }
    }
}