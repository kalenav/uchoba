beats(queen(XF, YF), cell(X, Y)):-
    \+ (X == XF, Y == YF),
    (X == XF; Y == YF; X-Y =:= XF-YF; X+Y =:= XF+YF).

beaten(Cell, Queens):-
    member(Queen, Queens),
    beats(Queen, Cell).
beaten(cell(X, Y), Queens, ignored_queen(XF, YF)):-
    \+ (X == XF, Y == YF),
    member(Queen, Queens),
    beats(Queen, cell(X, Y)).

occupied(cell(X, Y), Queens):-
    member(queen(XF, YF), Queens),
    X == XF,
    Y == YF,
    write(queen(XF, YF)), nl.

no_queens_beat_each_other([], _).
no_queens_beat_each_other([queen(XF, YF)|RemainingQueens], Queens):-
    \+ beaten(cell(XF, YF), Queens),
    no_queens_beat_each_other(RemainingQueens, Queens).

move_queen_to_non_beaten_cell_and_update_state(queen(XF, YF), CurrState, NewState):-
    (beaten(cell(XF, YF), CurrState) ->
        RowsAndColumns = [1, 2, 3, 4, 5, 6, 7, 8],
        member(X, RowsAndColumns),
        member(Y, RowsAndColumns),
        \+ beaten(cell(X, Y), CurrState, queen(XF, YF)),
        \+ occupied(cell(X, Y), CurrState),
        select(queen(XF, YF), CurrState, queen(X, Y), NewState) 
    ;
        NewState = CurrState
    ).

solve(CurrState, QueensMoved, Result):-
    (no_queens_beat_each_other(CurrState, CurrState); QueensMoved == 8 ->
        Result = CurrState
    ;
        NewQueensMoved is QueensMoved + 1,
        nth1(NewQueensMoved, CurrState, Queen),
        move_queen_to_non_beaten_cell_and_update_state(Queen, CurrState, NewState),
        solve(NewState, NewQueensMoved, Result)
    ).

solve_and_write(StartState):-
    solve(StartState, 0, Result),
    write(Result).