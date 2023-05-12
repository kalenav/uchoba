beats(queen(XF, YF), cell(X, Y)):-
    XF == X;
    YF == Y;
    XF-YF =:= X-Y;
    XF+YF =:= X+Y.

beaten(Cell, Queens):-
    member(Queen, Queens),
    beats(Queen, Cell).

place_queen(CurrSetup, NewSetup):-
    RowsAndColumns = [1, 2, 3, 4, 5, 6, 7, 8],
    member(X, RowsAndColumns),
    member(Y, RowsAndColumns),
    \+ beaten(cell(X, Y), CurrSetup),
    NewSetup = [queen(X, Y)|CurrSetup].

solve(CurrSetup):-
    length(CurrSetup, N),
    ( N == 8 -> write(CurrSetup) ;
      place_queen(CurrSetup, NewSetup),
      solve(NewSetup) ).