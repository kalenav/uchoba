beats(queen(XF, YF), cell(X, Y)) :-
    \+ (X == XF, Y == YF),
    (X == XF; Y == YF; X-Y =:= XF-YF; X+Y =:= XF+YF).

beaten(Cell, Queens):-
    member(Queen, Queens),
    beats(Queen, Cell).

no_queens_beat_each_other([], _).
no_queens_beat_each_other([queen(XF, YF)|RemainingQueens], Queens):-
    \+ beaten(cell(XF, YF), Queens),
    no_queens_beat_each_other(RemainingQueens, Queens).

solve(StartState):-
    no_queens_beat_each_other(StartState, StartState).