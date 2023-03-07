import nltk
from nltk.stem.snowball import SnowballStemmer
import pymorphy2
import re

morph_analyzer = pymorphy2.MorphAnalyzer()
stemmer = SnowballStemmer(language="russian")

MORPHOLOGIC_TRAIT_MAP = {
    'СУЩ': 'существительное',
    'ПРИЛ': 'прилагательное',
    'КР_ПРИЛ': 'краткое прилагательное',
    'ГЛ': 'глагол',
    'ИНФ': 'инфинитив',
    'ПРИЧ': 'причастие',
    'КР_ПРИЧ': 'краткое причастие',
    'ДЕЕПР': 'деепричастие',
    'ЧИСЛ': 'числительное',
    'Н': 'наречие',
    'МС': 'местоимение',
    'ПРЕДК': 'предикатив',
    'ПР': 'предлог',
    'СОЮЗ': 'союз',
    'ЧАСТ': 'частица',
    'МЕЖД': 'междометие',

    'од': 'одушевлённое',
    'неод': 'неодушевлённое',

    'мр': 'мужской род',
    'жр': 'женский род',
    'ср': 'средний род',
    'мж': 'общий род',

    'ед': 'единственное число',
    'мн': 'множественное число',
    '0': 'неизменяемое',

    'им': 'именительный падеж',
    'рд': 'родительный падеж',
    'дт': 'дательный падеж',
    'вн': 'винительный падеж',
    'тв': 'творительный падеж',
    'пр': 'предложный падеж',
    'зв': 'звательный падеж',

    'сов': 'совершенный вид',
    'несов': 'несовершенный вид',

    'перех': 'переходный',
    'неперех': 'непереходный',

    '1л': 'первое лицо',
    '2л': 'второе лицо',
    '3л': 'третье лицо',

    'наст': 'настоящее время',
    'прош': 'прошедшее время',
    'буд': 'будущее время',

    'ЗПР': 'знак препинания'
}

def get_word_info(word):
    return morph_analyzer.parse(word)[0].tag.cyr_repr

def extract_base(word):
    return stemmer.stem(word)

def derive_lexems(tokens):
    unique_tokens = list(set(tokens))
    normal_form_mapper = lambda token: morph_analyzer.parse(token)[0].normal_form
    return map(normal_form_mapper, unique_tokens)

sentence = input()
tokens = nltk.word_tokenize(sentence, language="russian")
word_info_dict = {}

for lexem in derive_lexems(tokens):
    word_info = get_word_info(lexem)
    dict_entry_str = ""
    dict_entry_str_starting_index = 2

    if not 'ЗПР' in word_info:
        dict_entry_str += ('основа: ' + extract_base(lexem))
        dict_entry_str_starting_index = 0

    for trait in re.findall(r'\w+', word_info):
        try:
            dict_entry_str += (', ' + MORPHOLOGIC_TRAIT_MAP[trait])
        except:
            pass

    word_info_dict[lexem] = dict_entry_str[dict_entry_str_starting_index:]

print(word_info_dict)