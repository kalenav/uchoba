// Generated from ExprParser.g4 by ANTLR 4.12.0
// jshint ignore: start
import antlr4 from 'antlr4';
import ExprParserListener from './ExprParserListener.js';
import ExprParserVisitor from './ExprParserVisitor.js';

const serializedATN = [4,1,37,229,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,
4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,
2,13,7,13,2,14,7,14,1,0,5,0,32,8,0,10,0,12,0,35,9,0,1,0,5,0,38,8,0,10,0,
12,0,41,9,0,1,0,1,0,1,1,1,1,1,1,3,1,48,8,1,1,1,1,1,1,1,3,1,53,8,1,3,1,55,
8,1,1,2,1,2,1,2,5,2,60,8,2,10,2,12,2,63,9,2,1,2,1,2,1,2,1,2,5,2,69,8,2,10,
2,12,2,72,9,2,1,2,1,2,1,3,1,3,1,3,1,3,1,3,1,3,5,3,82,8,3,10,3,12,3,85,9,
3,3,3,87,8,3,1,3,1,3,1,3,5,3,92,8,3,10,3,12,3,95,9,3,1,3,1,3,1,3,1,3,1,4,
1,4,1,4,1,4,1,4,5,4,106,8,4,10,4,12,4,109,9,4,3,4,111,8,4,1,4,1,4,1,5,1,
5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,3,5,128,8,5,1,5,1,5,4,5,132,
8,5,11,5,12,5,133,1,5,1,5,1,6,1,6,1,6,1,6,1,6,1,6,1,6,4,6,145,8,6,11,6,12,
6,146,1,6,1,6,1,6,4,6,152,8,6,11,6,12,6,153,3,6,156,8,6,1,6,1,6,1,7,1,7,
3,7,162,8,7,1,8,1,8,1,8,1,8,1,9,1,9,5,9,170,8,9,10,9,12,9,173,9,9,1,9,1,
9,1,10,1,10,1,10,1,10,5,10,181,8,10,10,10,12,10,184,9,10,3,10,186,8,10,1,
10,1,10,1,11,1,11,1,11,1,11,1,11,3,11,195,8,11,1,12,1,12,1,12,1,12,1,13,
1,13,1,13,1,13,1,13,3,13,206,8,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,
5,13,216,8,13,10,13,12,13,219,9,13,1,14,1,14,1,14,5,14,224,8,14,10,14,12,
14,227,9,14,1,14,2,171,225,1,26,15,0,2,4,6,8,10,12,14,16,18,20,22,24,26,
28,0,3,1,0,24,25,1,0,27,30,2,0,1,2,14,17,244,0,33,1,0,0,0,2,54,1,0,0,0,4,
56,1,0,0,0,6,75,1,0,0,0,8,100,1,0,0,0,10,114,1,0,0,0,12,137,1,0,0,0,14,161,
1,0,0,0,16,163,1,0,0,0,18,167,1,0,0,0,20,176,1,0,0,0,22,194,1,0,0,0,24,196,
1,0,0,0,26,205,1,0,0,0,28,220,1,0,0,0,30,32,3,6,3,0,31,30,1,0,0,0,32,35,
1,0,0,0,33,31,1,0,0,0,33,34,1,0,0,0,34,39,1,0,0,0,35,33,1,0,0,0,36,38,3,
2,1,0,37,36,1,0,0,0,38,41,1,0,0,0,39,37,1,0,0,0,39,40,1,0,0,0,40,42,1,0,
0,0,41,39,1,0,0,0,42,43,5,0,0,1,43,1,1,0,0,0,44,45,3,26,13,0,45,47,5,6,0,
0,46,48,3,28,14,0,47,46,1,0,0,0,47,48,1,0,0,0,48,55,1,0,0,0,49,55,3,14,7,
0,50,52,3,4,2,0,51,53,3,28,14,0,52,51,1,0,0,0,52,53,1,0,0,0,53,55,1,0,0,
0,54,44,1,0,0,0,54,49,1,0,0,0,54,50,1,0,0,0,55,3,1,0,0,0,56,61,5,36,0,0,
57,58,5,5,0,0,58,60,5,36,0,0,59,57,1,0,0,0,60,63,1,0,0,0,61,59,1,0,0,0,61,
62,1,0,0,0,62,64,1,0,0,0,63,61,1,0,0,0,64,65,5,4,0,0,65,70,3,26,13,0,66,
67,5,5,0,0,67,69,3,26,13,0,68,66,1,0,0,0,69,72,1,0,0,0,70,68,1,0,0,0,70,
71,1,0,0,0,71,73,1,0,0,0,72,70,1,0,0,0,73,74,5,6,0,0,74,5,1,0,0,0,75,76,
5,20,0,0,76,77,5,36,0,0,77,86,5,8,0,0,78,83,3,26,13,0,79,80,5,5,0,0,80,82,
3,26,13,0,81,79,1,0,0,0,82,85,1,0,0,0,83,81,1,0,0,0,83,84,1,0,0,0,84,87,
1,0,0,0,85,83,1,0,0,0,86,78,1,0,0,0,86,87,1,0,0,0,87,88,1,0,0,0,88,89,5,
9,0,0,89,93,5,7,0,0,90,92,3,2,1,0,91,90,1,0,0,0,92,95,1,0,0,0,93,91,1,0,
0,0,93,94,1,0,0,0,94,96,1,0,0,0,95,93,1,0,0,0,96,97,5,21,0,0,97,98,3,26,
13,0,98,99,5,6,0,0,99,7,1,0,0,0,100,101,5,36,0,0,101,110,5,8,0,0,102,107,
3,26,13,0,103,104,5,5,0,0,104,106,3,26,13,0,105,103,1,0,0,0,106,109,1,0,
0,0,107,105,1,0,0,0,107,108,1,0,0,0,108,111,1,0,0,0,109,107,1,0,0,0,110,
102,1,0,0,0,110,111,1,0,0,0,111,112,1,0,0,0,112,113,5,9,0,0,113,9,1,0,0,
0,114,115,5,22,0,0,115,116,5,36,0,0,116,127,5,23,0,0,117,118,7,0,0,0,118,
119,5,26,0,0,119,128,5,36,0,0,120,121,5,24,0,0,121,122,5,5,0,0,122,123,5,
25,0,0,123,124,5,26,0,0,124,125,5,36,0,0,125,126,5,5,0,0,126,128,5,36,0,
0,127,117,1,0,0,0,127,120,1,0,0,0,128,129,1,0,0,0,129,131,5,7,0,0,130,132,
3,2,1,0,131,130,1,0,0,0,132,133,1,0,0,0,133,131,1,0,0,0,133,134,1,0,0,0,
134,135,1,0,0,0,135,136,5,34,0,0,136,11,1,0,0,0,137,138,5,31,0,0,138,139,
5,8,0,0,139,140,3,24,12,0,140,141,5,9,0,0,141,142,5,32,0,0,142,144,5,7,0,
0,143,145,3,2,1,0,144,143,1,0,0,0,145,146,1,0,0,0,146,144,1,0,0,0,146,147,
1,0,0,0,147,155,1,0,0,0,148,149,5,33,0,0,149,151,5,7,0,0,150,152,3,2,1,0,
151,150,1,0,0,0,152,153,1,0,0,0,153,151,1,0,0,0,153,154,1,0,0,0,154,156,
1,0,0,0,155,148,1,0,0,0,155,156,1,0,0,0,156,157,1,0,0,0,157,158,5,34,0,0,
158,13,1,0,0,0,159,162,3,10,5,0,160,162,3,12,6,0,161,159,1,0,0,0,161,160,
1,0,0,0,162,15,1,0,0,0,163,164,5,18,0,0,164,165,9,0,0,0,165,166,5,18,0,0,
166,17,1,0,0,0,167,171,5,19,0,0,168,170,9,0,0,0,169,168,1,0,0,0,170,173,
1,0,0,0,171,172,1,0,0,0,171,169,1,0,0,0,172,174,1,0,0,0,173,171,1,0,0,0,
174,175,5,19,0,0,175,19,1,0,0,0,176,185,5,12,0,0,177,182,3,18,9,0,178,179,
5,5,0,0,179,181,3,18,9,0,180,178,1,0,0,0,181,184,1,0,0,0,182,180,1,0,0,0,
182,183,1,0,0,0,183,186,1,0,0,0,184,182,1,0,0,0,185,177,1,0,0,0,185,186,
1,0,0,0,186,187,1,0,0,0,187,188,5,13,0,0,188,21,1,0,0,0,189,195,5,36,0,0,
190,195,5,35,0,0,191,195,3,16,8,0,192,195,3,18,9,0,193,195,3,20,10,0,194,
189,1,0,0,0,194,190,1,0,0,0,194,191,1,0,0,0,194,192,1,0,0,0,194,193,1,0,
0,0,195,23,1,0,0,0,196,197,3,26,13,0,197,198,7,1,0,0,198,199,3,26,13,0,199,
25,1,0,0,0,200,201,6,13,-1,0,201,206,3,22,11,0,202,206,3,8,4,0,203,204,5,
3,0,0,204,206,3,26,13,3,205,200,1,0,0,0,205,202,1,0,0,0,205,203,1,0,0,0,
206,217,1,0,0,0,207,208,10,2,0,0,208,209,7,2,0,0,209,216,3,26,13,3,210,211,
10,1,0,0,211,212,5,12,0,0,212,213,3,26,13,0,213,214,5,13,0,0,214,216,1,0,
0,0,215,207,1,0,0,0,215,210,1,0,0,0,216,219,1,0,0,0,217,215,1,0,0,0,217,
218,1,0,0,0,218,27,1,0,0,0,219,217,1,0,0,0,220,221,5,17,0,0,221,225,5,17,
0,0,222,224,9,0,0,0,223,222,1,0,0,0,224,227,1,0,0,0,225,226,1,0,0,0,225,
223,1,0,0,0,226,29,1,0,0,0,227,225,1,0,0,0,26,33,39,47,52,54,61,70,83,86,
93,107,110,127,133,146,153,155,161,171,182,185,194,205,215,217,225];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class ExprParser extends antlr4.Parser {

    static grammarFileName = "ExprParser.g4";
    static literalNames = [ null, "'&&'", "'||'", "'!'", "'='", "','", "';'", 
                            "':'", "'('", "')'", "'{'", "'}'", "'['", "']'", 
                            "'+'", "'-'", "'*'", "'/'", "'''", "'\"'", "'function'", 
                            "'return'", "'iterate'", "'track'", "'EL'", 
                            "'INDEX'", "'as'", "'=='", "'>'", "'<'", "'!='", 
                            "'if'", "'then'", "'else'" ];
    static symbolicNames = [ null, "AND", "OR", "NOT", "ASSIGN", "COMMA", 
                             "SEMI", "COLON", "LPAREN", "RPAREN", "LCURLY", 
                             "RCURLY", "LSQUARE", "RSQUARE", "ADD", "SUB", 
                             "MUL", "DIV", "SINGLE_QUOTE", "DOUBLE_QUOTE", 
                             "DEF", "RETURN", "ITERATE", "TRACK", "EL", 
                             "INDEX", "AS", "EQ", "GREATER", "LESS", "NOEQ", 
                             "IF", "THEN", "ELSE", "END", "INT", "ID", "WS" ];
    static ruleNames = [ "program", "statement", "assignment", "function", 
                         "call", "cycle", "if", "control", "char", "string", 
                         "strarray", "operand", "condition", "expr", "comment" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = ExprParser.ruleNames;
        this.literalNames = ExprParser.literalNames;
        this.symbolicNames = ExprParser.symbolicNames;
    }

    sempred(localctx, ruleIndex, predIndex) {
    	switch(ruleIndex) {
    	case 13:
    	    		return this.expr_sempred(localctx, predIndex);
        default:
            throw "No predicate with index:" + ruleIndex;
       }
    }

    expr_sempred(localctx, predIndex) {
    	switch(predIndex) {
    		case 0:
    			return this.precpred(this._ctx, 2);
    		case 1:
    			return this.precpred(this._ctx, 1);
    		default:
    			throw "No predicate with index:" + predIndex;
    	}
    };




	program() {
	    let localctx = new ProgramContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, ExprParser.RULE_program);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 33;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===20) {
	            this.state = 30;
	            this.function_();
	            this.state = 35;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 39;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while((((_la) & ~0x1f) === 0 && ((1 << _la) & 2152468488) !== 0) || _la===35 || _la===36) {
	            this.state = 36;
	            this.statement();
	            this.state = 41;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 42;
	        this.match(ExprParser.EOF);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	statement() {
	    let localctx = new StatementContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, ExprParser.RULE_statement);
	    var _la = 0;
	    try {
	        this.state = 54;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,4,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 44;
	            this.expr(0);
	            this.state = 45;
	            this.match(ExprParser.SEMI);
	            this.state = 47;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===17) {
	                this.state = 46;
	                this.comment();
	            }

	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 49;
	            this.control();
	            break;

	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 50;
	            this.assignment();
	            this.state = 52;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===17) {
	                this.state = 51;
	                this.comment();
	            }

	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	assignment() {
	    let localctx = new AssignmentContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, ExprParser.RULE_assignment);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 56;
	        this.match(ExprParser.ID);
	        this.state = 61;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===5) {
	            this.state = 57;
	            this.match(ExprParser.COMMA);
	            this.state = 58;
	            this.match(ExprParser.ID);
	            this.state = 63;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 64;
	        this.match(ExprParser.ASSIGN);
	        this.state = 65;
	        this.expr(0);
	        this.state = 70;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===5) {
	            this.state = 66;
	            this.match(ExprParser.COMMA);
	            this.state = 67;
	            this.expr(0);
	            this.state = 72;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 73;
	        this.match(ExprParser.SEMI);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	function_() {
	    let localctx = new FunctionContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, ExprParser.RULE_function);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 75;
	        this.match(ExprParser.DEF);
	        this.state = 76;
	        this.match(ExprParser.ID);
	        this.state = 77;
	        this.match(ExprParser.LPAREN);
	        this.state = 86;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if((((_la) & ~0x1f) === 0 && ((1 << _la) & 790536) !== 0) || _la===35 || _la===36) {
	            this.state = 78;
	            this.expr(0);
	            this.state = 83;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===5) {
	                this.state = 79;
	                this.match(ExprParser.COMMA);
	                this.state = 80;
	                this.expr(0);
	                this.state = 85;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	        }

	        this.state = 88;
	        this.match(ExprParser.RPAREN);
	        this.state = 89;
	        this.match(ExprParser.COLON);
	        this.state = 93;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while((((_la) & ~0x1f) === 0 && ((1 << _la) & 2152468488) !== 0) || _la===35 || _la===36) {
	            this.state = 90;
	            this.statement();
	            this.state = 95;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 96;
	        this.match(ExprParser.RETURN);
	        this.state = 97;
	        this.expr(0);
	        this.state = 98;
	        this.match(ExprParser.SEMI);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	call() {
	    let localctx = new CallContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, ExprParser.RULE_call);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 100;
	        this.match(ExprParser.ID);
	        this.state = 101;
	        this.match(ExprParser.LPAREN);
	        this.state = 110;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if((((_la) & ~0x1f) === 0 && ((1 << _la) & 790536) !== 0) || _la===35 || _la===36) {
	            this.state = 102;
	            this.expr(0);
	            this.state = 107;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===5) {
	                this.state = 103;
	                this.match(ExprParser.COMMA);
	                this.state = 104;
	                this.expr(0);
	                this.state = 109;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	        }

	        this.state = 112;
	        this.match(ExprParser.RPAREN);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	cycle() {
	    let localctx = new CycleContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, ExprParser.RULE_cycle);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 114;
	        this.match(ExprParser.ITERATE);
	        this.state = 115;
	        this.match(ExprParser.ID);
	        this.state = 116;
	        this.match(ExprParser.TRACK);
	        this.state = 127;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,12,this._ctx);
	        switch(la_) {
	        case 1:
	            this.state = 117;
	            _la = this._input.LA(1);
	            if(!(_la===24 || _la===25)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 118;
	            this.match(ExprParser.AS);
	            this.state = 119;
	            this.match(ExprParser.ID);
	            break;

	        case 2:
	            this.state = 120;
	            this.match(ExprParser.EL);
	            this.state = 121;
	            this.match(ExprParser.COMMA);
	            this.state = 122;
	            this.match(ExprParser.INDEX);
	            this.state = 123;
	            this.match(ExprParser.AS);
	            this.state = 124;
	            this.match(ExprParser.ID);
	            this.state = 125;
	            this.match(ExprParser.COMMA);
	            this.state = 126;
	            this.match(ExprParser.ID);
	            break;

	        }
	        this.state = 129;
	        this.match(ExprParser.COLON);
	        this.state = 131; 
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        do {
	            this.state = 130;
	            this.statement();
	            this.state = 133; 
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        } while((((_la) & ~0x1f) === 0 && ((1 << _la) & 2152468488) !== 0) || _la===35 || _la===36);
	        this.state = 135;
	        this.match(ExprParser.END);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	if_() {
	    let localctx = new IfContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 12, ExprParser.RULE_if);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 137;
	        this.match(ExprParser.IF);
	        this.state = 138;
	        this.match(ExprParser.LPAREN);
	        this.state = 139;
	        this.condition();
	        this.state = 140;
	        this.match(ExprParser.RPAREN);
	        this.state = 141;
	        this.match(ExprParser.THEN);
	        this.state = 142;
	        this.match(ExprParser.COLON);
	        this.state = 144; 
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        do {
	            this.state = 143;
	            this.statement();
	            this.state = 146; 
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        } while((((_la) & ~0x1f) === 0 && ((1 << _la) & 2152468488) !== 0) || _la===35 || _la===36);
	        this.state = 155;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===33) {
	            this.state = 148;
	            this.match(ExprParser.ELSE);
	            this.state = 149;
	            this.match(ExprParser.COLON);
	            this.state = 151; 
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            do {
	                this.state = 150;
	                this.statement();
	                this.state = 153; 
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            } while((((_la) & ~0x1f) === 0 && ((1 << _la) & 2152468488) !== 0) || _la===35 || _la===36);
	        }

	        this.state = 157;
	        this.match(ExprParser.END);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	control() {
	    let localctx = new ControlContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 14, ExprParser.RULE_control);
	    try {
	        this.state = 161;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 22:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 159;
	            this.cycle();
	            break;
	        case 31:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 160;
	            this.if_();
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	char_() {
	    let localctx = new CharContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 16, ExprParser.RULE_char);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 163;
	        this.match(ExprParser.SINGLE_QUOTE);
	        this.state = 164;
	        this.matchWildcard();
	        this.state = 165;
	        this.match(ExprParser.SINGLE_QUOTE);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	string() {
	    let localctx = new StringContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 18, ExprParser.RULE_string);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 167;
	        this.match(ExprParser.DOUBLE_QUOTE);
	        this.state = 171;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,18,this._ctx)
	        while(_alt!=1 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1+1) {
	                this.state = 168;
	                this.matchWildcard(); 
	            }
	            this.state = 173;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,18,this._ctx);
	        }

	        this.state = 174;
	        this.match(ExprParser.DOUBLE_QUOTE);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	strarray() {
	    let localctx = new StrarrayContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 20, ExprParser.RULE_strarray);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 176;
	        this.match(ExprParser.LSQUARE);
	        this.state = 185;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===19) {
	            this.state = 177;
	            this.string();
	            this.state = 182;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===5) {
	                this.state = 178;
	                this.match(ExprParser.COMMA);
	                this.state = 179;
	                this.string();
	                this.state = 184;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	        }

	        this.state = 187;
	        this.match(ExprParser.RSQUARE);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	operand() {
	    let localctx = new OperandContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 22, ExprParser.RULE_operand);
	    try {
	        this.state = 194;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 36:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 189;
	            this.match(ExprParser.ID);
	            break;
	        case 35:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 190;
	            this.match(ExprParser.INT);
	            break;
	        case 18:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 191;
	            this.char_();
	            break;
	        case 19:
	            this.enterOuterAlt(localctx, 4);
	            this.state = 192;
	            this.string();
	            break;
	        case 12:
	            this.enterOuterAlt(localctx, 5);
	            this.state = 193;
	            this.strarray();
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	condition() {
	    let localctx = new ConditionContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 24, ExprParser.RULE_condition);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 196;
	        this.expr(0);
	        this.state = 197;
	        _la = this._input.LA(1);
	        if(!((((_la) & ~0x1f) === 0 && ((1 << _la) & 2013265920) !== 0))) {
	        this._errHandler.recoverInline(this);
	        }
	        else {
	        	this._errHandler.reportMatch(this);
	            this.consume();
	        }
	        this.state = 198;
	        this.expr(0);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	expr(_p) {
		if(_p===undefined) {
		    _p = 0;
		}
	    const _parentctx = this._ctx;
	    const _parentState = this.state;
	    let localctx = new ExprContext(this, this._ctx, _parentState);
	    let _prevctx = localctx;
	    const _startState = 26;
	    this.enterRecursionRule(localctx, 26, ExprParser.RULE_expr, _p);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 205;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,22,this._ctx);
	        switch(la_) {
	        case 1:
	            this.state = 201;
	            this.operand();
	            break;

	        case 2:
	            this.state = 202;
	            this.call();
	            break;

	        case 3:
	            this.state = 203;
	            this.match(ExprParser.NOT);
	            this.state = 204;
	            this.expr(3);
	            break;

	        }
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 217;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,24,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                if(this._parseListeners!==null) {
	                    this.triggerExitRuleEvent();
	                }
	                _prevctx = localctx;
	                this.state = 215;
	                this._errHandler.sync(this);
	                var la_ = this._interp.adaptivePredict(this._input,23,this._ctx);
	                switch(la_) {
	                case 1:
	                    localctx = new ExprContext(this, _parentctx, _parentState);
	                    this.pushNewRecursionContext(localctx, _startState, ExprParser.RULE_expr);
	                    this.state = 207;
	                    if (!( this.precpred(this._ctx, 2))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
	                    }
	                    this.state = 208;
	                    _la = this._input.LA(1);
	                    if(!((((_la) & ~0x1f) === 0 && ((1 << _la) & 245766) !== 0))) {
	                    this._errHandler.recoverInline(this);
	                    }
	                    else {
	                    	this._errHandler.reportMatch(this);
	                        this.consume();
	                    }
	                    this.state = 209;
	                    this.expr(3);
	                    break;

	                case 2:
	                    localctx = new ExprContext(this, _parentctx, _parentState);
	                    this.pushNewRecursionContext(localctx, _startState, ExprParser.RULE_expr);
	                    this.state = 210;
	                    if (!( this.precpred(this._ctx, 1))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
	                    }
	                    this.state = 211;
	                    this.match(ExprParser.LSQUARE);
	                    this.state = 212;
	                    this.expr(0);
	                    this.state = 213;
	                    this.match(ExprParser.RSQUARE);
	                    break;

	                } 
	            }
	            this.state = 219;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,24,this._ctx);
	        }

	    } catch( error) {
	        if(error instanceof antlr4.error.RecognitionException) {
		        localctx.exception = error;
		        this._errHandler.reportError(this, error);
		        this._errHandler.recover(this, error);
		    } else {
		    	throw error;
		    }
	    } finally {
	        this.unrollRecursionContexts(_parentctx)
	    }
	    return localctx;
	}



	comment() {
	    let localctx = new CommentContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 28, ExprParser.RULE_comment);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 220;
	        this.match(ExprParser.DIV);
	        this.state = 221;
	        this.match(ExprParser.DIV);
	        this.state = 225;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,25,this._ctx)
	        while(_alt!=1 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1+1) {
	                this.state = 222;
	                this.matchWildcard(); 
	            }
	            this.state = 227;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,25,this._ctx);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


}

ExprParser.EOF = antlr4.Token.EOF;
ExprParser.AND = 1;
ExprParser.OR = 2;
ExprParser.NOT = 3;
ExprParser.ASSIGN = 4;
ExprParser.COMMA = 5;
ExprParser.SEMI = 6;
ExprParser.COLON = 7;
ExprParser.LPAREN = 8;
ExprParser.RPAREN = 9;
ExprParser.LCURLY = 10;
ExprParser.RCURLY = 11;
ExprParser.LSQUARE = 12;
ExprParser.RSQUARE = 13;
ExprParser.ADD = 14;
ExprParser.SUB = 15;
ExprParser.MUL = 16;
ExprParser.DIV = 17;
ExprParser.SINGLE_QUOTE = 18;
ExprParser.DOUBLE_QUOTE = 19;
ExprParser.DEF = 20;
ExprParser.RETURN = 21;
ExprParser.ITERATE = 22;
ExprParser.TRACK = 23;
ExprParser.EL = 24;
ExprParser.INDEX = 25;
ExprParser.AS = 26;
ExprParser.EQ = 27;
ExprParser.GREATER = 28;
ExprParser.LESS = 29;
ExprParser.NOEQ = 30;
ExprParser.IF = 31;
ExprParser.THEN = 32;
ExprParser.ELSE = 33;
ExprParser.END = 34;
ExprParser.INT = 35;
ExprParser.ID = 36;
ExprParser.WS = 37;

ExprParser.RULE_program = 0;
ExprParser.RULE_statement = 1;
ExprParser.RULE_assignment = 2;
ExprParser.RULE_function = 3;
ExprParser.RULE_call = 4;
ExprParser.RULE_cycle = 5;
ExprParser.RULE_if = 6;
ExprParser.RULE_control = 7;
ExprParser.RULE_char = 8;
ExprParser.RULE_string = 9;
ExprParser.RULE_strarray = 10;
ExprParser.RULE_operand = 11;
ExprParser.RULE_condition = 12;
ExprParser.RULE_expr = 13;
ExprParser.RULE_comment = 14;

class ProgramContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ExprParser.RULE_program;
    }

	EOF() {
	    return this.getToken(ExprParser.EOF, 0);
	};

	function_ = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(FunctionContext);
	    } else {
	        return this.getTypedRuleContext(FunctionContext,i);
	    }
	};

	statement = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(StatementContext);
	    } else {
	        return this.getTypedRuleContext(StatementContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.enterProgram(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.exitProgram(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof ExprParserVisitor ) {
	        return visitor.visitProgram(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class StatementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ExprParser.RULE_statement;
    }

	expr() {
	    return this.getTypedRuleContext(ExprContext,0);
	};

	SEMI() {
	    return this.getToken(ExprParser.SEMI, 0);
	};

	comment() {
	    return this.getTypedRuleContext(CommentContext,0);
	};

	control() {
	    return this.getTypedRuleContext(ControlContext,0);
	};

	assignment() {
	    return this.getTypedRuleContext(AssignmentContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.enterStatement(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.exitStatement(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof ExprParserVisitor ) {
	        return visitor.visitStatement(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class AssignmentContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ExprParser.RULE_assignment;
    }

	ID = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ExprParser.ID);
	    } else {
	        return this.getToken(ExprParser.ID, i);
	    }
	};


	ASSIGN() {
	    return this.getToken(ExprParser.ASSIGN, 0);
	};

	expr = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExprContext);
	    } else {
	        return this.getTypedRuleContext(ExprContext,i);
	    }
	};

	SEMI() {
	    return this.getToken(ExprParser.SEMI, 0);
	};

	COMMA = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ExprParser.COMMA);
	    } else {
	        return this.getToken(ExprParser.COMMA, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.enterAssignment(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.exitAssignment(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof ExprParserVisitor ) {
	        return visitor.visitAssignment(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class FunctionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ExprParser.RULE_function;
    }

	DEF() {
	    return this.getToken(ExprParser.DEF, 0);
	};

	ID() {
	    return this.getToken(ExprParser.ID, 0);
	};

	LPAREN() {
	    return this.getToken(ExprParser.LPAREN, 0);
	};

	RPAREN() {
	    return this.getToken(ExprParser.RPAREN, 0);
	};

	COLON() {
	    return this.getToken(ExprParser.COLON, 0);
	};

	RETURN() {
	    return this.getToken(ExprParser.RETURN, 0);
	};

	expr = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExprContext);
	    } else {
	        return this.getTypedRuleContext(ExprContext,i);
	    }
	};

	SEMI() {
	    return this.getToken(ExprParser.SEMI, 0);
	};

	statement = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(StatementContext);
	    } else {
	        return this.getTypedRuleContext(StatementContext,i);
	    }
	};

	COMMA = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ExprParser.COMMA);
	    } else {
	        return this.getToken(ExprParser.COMMA, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.enterFunction(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.exitFunction(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof ExprParserVisitor ) {
	        return visitor.visitFunction(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class CallContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ExprParser.RULE_call;
    }

	ID() {
	    return this.getToken(ExprParser.ID, 0);
	};

	LPAREN() {
	    return this.getToken(ExprParser.LPAREN, 0);
	};

	RPAREN() {
	    return this.getToken(ExprParser.RPAREN, 0);
	};

	expr = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExprContext);
	    } else {
	        return this.getTypedRuleContext(ExprContext,i);
	    }
	};

	COMMA = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ExprParser.COMMA);
	    } else {
	        return this.getToken(ExprParser.COMMA, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.enterCall(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.exitCall(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof ExprParserVisitor ) {
	        return visitor.visitCall(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class CycleContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ExprParser.RULE_cycle;
    }

	ITERATE() {
	    return this.getToken(ExprParser.ITERATE, 0);
	};

	ID = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ExprParser.ID);
	    } else {
	        return this.getToken(ExprParser.ID, i);
	    }
	};


	TRACK() {
	    return this.getToken(ExprParser.TRACK, 0);
	};

	COLON() {
	    return this.getToken(ExprParser.COLON, 0);
	};

	END() {
	    return this.getToken(ExprParser.END, 0);
	};

	AS() {
	    return this.getToken(ExprParser.AS, 0);
	};

	EL() {
	    return this.getToken(ExprParser.EL, 0);
	};

	COMMA = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ExprParser.COMMA);
	    } else {
	        return this.getToken(ExprParser.COMMA, i);
	    }
	};


	INDEX() {
	    return this.getToken(ExprParser.INDEX, 0);
	};

	statement = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(StatementContext);
	    } else {
	        return this.getTypedRuleContext(StatementContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.enterCycle(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.exitCycle(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof ExprParserVisitor ) {
	        return visitor.visitCycle(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class IfContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ExprParser.RULE_if;
    }

	IF() {
	    return this.getToken(ExprParser.IF, 0);
	};

	LPAREN() {
	    return this.getToken(ExprParser.LPAREN, 0);
	};

	condition() {
	    return this.getTypedRuleContext(ConditionContext,0);
	};

	RPAREN() {
	    return this.getToken(ExprParser.RPAREN, 0);
	};

	THEN() {
	    return this.getToken(ExprParser.THEN, 0);
	};

	COLON = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ExprParser.COLON);
	    } else {
	        return this.getToken(ExprParser.COLON, i);
	    }
	};


	END() {
	    return this.getToken(ExprParser.END, 0);
	};

	statement = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(StatementContext);
	    } else {
	        return this.getTypedRuleContext(StatementContext,i);
	    }
	};

	ELSE() {
	    return this.getToken(ExprParser.ELSE, 0);
	};

	enterRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.enterIf(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.exitIf(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof ExprParserVisitor ) {
	        return visitor.visitIf(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class ControlContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ExprParser.RULE_control;
    }

	cycle() {
	    return this.getTypedRuleContext(CycleContext,0);
	};

	if_() {
	    return this.getTypedRuleContext(IfContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.enterControl(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.exitControl(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof ExprParserVisitor ) {
	        return visitor.visitControl(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class CharContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ExprParser.RULE_char;
    }

	SINGLE_QUOTE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ExprParser.SINGLE_QUOTE);
	    } else {
	        return this.getToken(ExprParser.SINGLE_QUOTE, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.enterChar(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.exitChar(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof ExprParserVisitor ) {
	        return visitor.visitChar(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class StringContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ExprParser.RULE_string;
    }

	DOUBLE_QUOTE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ExprParser.DOUBLE_QUOTE);
	    } else {
	        return this.getToken(ExprParser.DOUBLE_QUOTE, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.enterString(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.exitString(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof ExprParserVisitor ) {
	        return visitor.visitString(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class StrarrayContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ExprParser.RULE_strarray;
    }

	LSQUARE() {
	    return this.getToken(ExprParser.LSQUARE, 0);
	};

	RSQUARE() {
	    return this.getToken(ExprParser.RSQUARE, 0);
	};

	string = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(StringContext);
	    } else {
	        return this.getTypedRuleContext(StringContext,i);
	    }
	};

	COMMA = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ExprParser.COMMA);
	    } else {
	        return this.getToken(ExprParser.COMMA, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.enterStrarray(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.exitStrarray(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof ExprParserVisitor ) {
	        return visitor.visitStrarray(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class OperandContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ExprParser.RULE_operand;
    }

	ID() {
	    return this.getToken(ExprParser.ID, 0);
	};

	INT() {
	    return this.getToken(ExprParser.INT, 0);
	};

	char_() {
	    return this.getTypedRuleContext(CharContext,0);
	};

	string() {
	    return this.getTypedRuleContext(StringContext,0);
	};

	strarray() {
	    return this.getTypedRuleContext(StrarrayContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.enterOperand(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.exitOperand(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof ExprParserVisitor ) {
	        return visitor.visitOperand(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class ConditionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ExprParser.RULE_condition;
    }

	expr = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExprContext);
	    } else {
	        return this.getTypedRuleContext(ExprContext,i);
	    }
	};

	EQ() {
	    return this.getToken(ExprParser.EQ, 0);
	};

	GREATER() {
	    return this.getToken(ExprParser.GREATER, 0);
	};

	LESS() {
	    return this.getToken(ExprParser.LESS, 0);
	};

	NOEQ() {
	    return this.getToken(ExprParser.NOEQ, 0);
	};

	enterRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.enterCondition(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.exitCondition(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof ExprParserVisitor ) {
	        return visitor.visitCondition(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class ExprContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ExprParser.RULE_expr;
    }

	operand() {
	    return this.getTypedRuleContext(OperandContext,0);
	};

	call() {
	    return this.getTypedRuleContext(CallContext,0);
	};

	NOT() {
	    return this.getToken(ExprParser.NOT, 0);
	};

	expr = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExprContext);
	    } else {
	        return this.getTypedRuleContext(ExprContext,i);
	    }
	};

	AND() {
	    return this.getToken(ExprParser.AND, 0);
	};

	OR() {
	    return this.getToken(ExprParser.OR, 0);
	};

	ADD() {
	    return this.getToken(ExprParser.ADD, 0);
	};

	SUB() {
	    return this.getToken(ExprParser.SUB, 0);
	};

	MUL() {
	    return this.getToken(ExprParser.MUL, 0);
	};

	DIV() {
	    return this.getToken(ExprParser.DIV, 0);
	};

	LSQUARE() {
	    return this.getToken(ExprParser.LSQUARE, 0);
	};

	RSQUARE() {
	    return this.getToken(ExprParser.RSQUARE, 0);
	};

	enterRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.enterExpr(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.exitExpr(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof ExprParserVisitor ) {
	        return visitor.visitExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class CommentContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = ExprParser.RULE_comment;
    }

	DIV = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(ExprParser.DIV);
	    } else {
	        return this.getToken(ExprParser.DIV, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.enterComment(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof ExprParserListener ) {
	        listener.exitComment(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof ExprParserVisitor ) {
	        return visitor.visitComment(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}




ExprParser.ProgramContext = ProgramContext; 
ExprParser.StatementContext = StatementContext; 
ExprParser.AssignmentContext = AssignmentContext; 
ExprParser.FunctionContext = FunctionContext; 
ExprParser.CallContext = CallContext; 
ExprParser.CycleContext = CycleContext; 
ExprParser.IfContext = IfContext; 
ExprParser.ControlContext = ControlContext; 
ExprParser.CharContext = CharContext; 
ExprParser.StringContext = StringContext; 
ExprParser.StrarrayContext = StrarrayContext; 
ExprParser.OperandContext = OperandContext; 
ExprParser.ConditionContext = ConditionContext; 
ExprParser.ExprContext = ExprContext; 
ExprParser.CommentContext = CommentContext; 
