parser grammar ExprParser;
options { tokenVocab=ExprLexer; }

program
    : (function)* (statement)* EOF
    ;

statement
    : expr SEMI comment?
    | control
    | assignment comment?
    ;
    
assignment
    : ID (COMMA ID)*
      ASSIGN
      expr (COMMA expr)*
      SEMI
    ;

function 
    : DEF ID
      LPAREN (expr (COMMA expr)*)? RPAREN
      COLON
      statement*
      RETURN expr SEMI
    ;
    
call
    : ID LPAREN (expr (COMMA expr)*)? RPAREN ;
    
cycle
    : ITERATE ID
      TRACK (
          (EL|INDEX) AS ID
          | EL COMMA INDEX AS ID COMMA ID
      )
      COLON
      statement+
      END
    ;
    
if
    : IF LPAREN condition RPAREN
      THEN COLON statement+
      (ELSE COLON statement+)?
      END
    ;
    
control
    : cycle
    | if
    ;
    
char
    : SINGLE_QUOTE . SINGLE_QUOTE
    ;
    
string
    : DOUBLE_QUOTE (.)*? DOUBLE_QUOTE
    ;
    
strarray
    : LSQUARE (string (COMMA string)*)? RSQUARE
    ;
    
operand
    : ID
    | INT
    | char
    | string
    | strarray
    ;
    
condition
    : expr (EQ|GREATER|LESS|NOEQ) expr
    ;

expr
    : operand
    | call
    | NOT expr
    | expr (AND|OR|ADD|SUB|MUL|DIV) expr
    | expr LSQUARE expr RSQUARE
    ;

comment
    : DIV DIV (.)*?
    ;