import nltk
import pymorphy2
import re

morph_analyzer = pymorphy2.MorphAnalyzer()

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

PREFIXES = [
    'в',
    'во',
    'взо',
    'вне',
    'внутри',
    'возо',
    'вы',
    'до',
    'еже',
    'за',
    'зако',
    'изо',
    'испод',
    'к',
    'кое',
    'ку',
    'меж',
    'междо',
    'между',
    'на',
    'над',
    'надо',
    'наи',
    'не',
    'недо',
    'ни',
    'низо',
    'о',
    'об',
    'обо',
    'около',
    'от',
    'ото',
    'па',
    'пере',
    'по',
    'под',
    'подо',
    'поза',
    'после',
    'пра',
    'пред',
    'преди',
    'предо',
    'про',
    'противо',
    'разо',
    'с',
    'со',
    'сверх',
    'среди',
    'су',
    'тре',
    'у'
]

POSSIBLE_MORPHEMS_BY_PART_OF_SPEECH = {
    'существительное': {
        'suffixes': [
            'кос',
            'кас',
            'к',
            'ик',
            'ек',
            'ок',
            'чик',
            'ёк',
            'еньк',
            'оньк',
            'ечк',
            'ичк',
            'очк',
            'ашк',
            'ишк',
            'ушк',
            'юшк',
            'ышк',
            'ец',
            'иц',
            'енк',
            'инк',
            'онк',
            'ин',
            'ищ',
            'ушек',
            'ышек',
            'ёныш',
            'тель',
            'чик',
            'щик',
            'ник',
            'ниц',
            'иц',
            'юх',
            'ёнок',
            'ость',
            'як',
            'ун',
            'ач',
            'ущ',
        ],
        'endings': ['а', 'я', 'о', 'е', '']
    },
    'прилагательное': {
        'suffixes': [
            'еньк',
            'оньк',
            'ехоньк',
            'оханьк',
            'ёшеньк',
            'ошеньк',
            'ущ',
            'ющ',
            'юсеньк',
            'енн',
            'оват',
            'ив',
            'чив',
            'лив',
            'ист',
            'ск',
            'ов',
            'ев',
            'н',
            'евит',
            'ин'
        ],
        'endings': ['ой', 'ий', 'ый', 'ая', 'яя', 'ое', 'ее']
    },
    'глагол': {
        'suffixes': ['ова', 'ева', 'ыва', 'и', 'я', 'е', 'а', 'л'],
        'endings': ['ю', 'у', 'ем', 'им', 'ешь', 'ете', 'ишь', 'ите', 'ет', 'ют', 'ут', 'ит', 'ят']
    },
    'инфитив': {
        'suffixes': ['ть', 'ти', 'чь'],
        'endings': []
    }
}

def get_word_info(word):
    return morph_analyzer.parse(word)[0].tag.cyr_repr

def get_normal_form(word):
    return morph_analyzer.parse(word)[0].normal_form

def get_part_of_speech(word):
    return morph_analyzer.parse(word)[0].tag.cyr_repr

def extract_base(word):
    base = ""
    word_forms = list(map(lambda parse: parse.word, morph_analyzer.parse(word)[0].lexeme))

    for index in range(0, len(word)):
        symbol = word[index]
        include_symbol_in_base = True

        for word_form in word_forms:
            if (word_form[index] != symbol):
                include_symbol_in_base = False
                break

        if include_symbol_in_base:
            base += symbol
        else:
            break

    return base


def extract_ending(word):
    ending = ""
    base = extract_base(word)

    for index in range(len(base), len(word)):
        ending += word[index]

    return ending

def derive_lexems(tokens):
    unique_tokens = list(set(tokens))
    return map(get_normal_form, unique_tokens)

sentence = input()
tokens = nltk.word_tokenize(sentence, language="russian")
word_info_dict = {}

for lexem in derive_lexems(tokens):
    word_info = get_word_info(lexem)
    dict_entry_str = ""
    dict_entry_str_starting_index = 2

    if 'ЗПР' not in word_info:
        dict_entry_str += ('основа: ' + extract_base(lexem))
        dict_entry_str += (', окончание: ' + extract_ending(lexem))
        dict_entry_str_starting_index = 0

    for trait in re.findall(r'\w+', word_info):
        try:
            dict_entry_str += (', ' + MORPHOLOGIC_TRAIT_MAP[trait])
        except:
            pass

    word_info_dict[lexem] = dict_entry_str[dict_entry_str_starting_index:]

print(word_info_dict)