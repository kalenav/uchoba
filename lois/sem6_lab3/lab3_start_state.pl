beats(queen(XF, YF), cell(X, Y)) :-
    \+ (X == XF, Y == YF),
    (X == XF; Y == YF; X-Y =:= XF-YF; X+Y =:= XF+YF).

beaten(Cell, Queens):-
    member(Queen, Queens),
    beats(Queen, Cell).

beaten(Cell, Queens, IgnoredQueen):-
    member(Queen, Queens),
    Queen \= IgnoredQueen,
    beats(Queen, Cell).

no_queens_beat_each_other([], _).
no_queens_beat_each_other([queen(XF, YF)|RemainingQueens], Queens):-
    \+ beaten(cell(XF, YF), Queens),
    no_queens_beat_each_other(RemainingQueens, Queens).

move_queen_to_non_beaten_cell_and_update_new_queen_list(queen(XF, YF), Queens, Result):-
    beaten(cell(XF, YF), Queens),
    RowsAndColumns = [1, 2, 3, 4, 5, 6, 7, 8],
    member(X, RowsAndColumns),
    member(Y, RowsAndColumns),
    \+ beaten(cell(X, Y), Queens, queen(XF, YF)),
    # write(queen(X, Y)).

solve(StartState, Result):-
    (no_queens_beat_each_other(StartState, StartState) ->
        Result = StartState
    ;
        # move_queens_to_non_beaten_cells(StartState, StartState, Result)
    ).

solve_and_write(State):-
    solve(State, Result),
    write(Result).