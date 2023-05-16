# Лабораторная работа №3 по дисциплине "Логические основы интеллектуальных систем"
# Выполнена студентом группы 021702 БГУИР Локтевым Константином Алексеевичем
# Файл с описанием правил и фактов, необходимых для расстановки ферзей на шахматной доске
# 15.05.2023

beats(queen(XF, YF), cell(X, Y)):-
    \+ (X == XF, Y == YF),
    (X == XF; Y == YF; X-Y =:= XF-YF; X+Y =:= XF+YF).

beaten(Cell, Queens):-
    member(Queen, Queens),
    beats(Queen, Cell).
beaten(cell(X, Y), Queens, ignored_queen(XF, YF)):-
    selectchk(queen(XF, YF), Queens, NewQueens),
    member(Queen, NewQueens),
    beats(Queen, cell(X, Y)).

occupied(cell(X, Y), Queens):-
    member(queen(XF, YF), Queens),
    X == XF,
    Y == YF.

no_queens_beat_each_other([], _).
no_queens_beat_each_other([queen(XF, YF)|RemainingQueens], Queens):-
    \+ beaten(cell(XF, YF), Queens),
    no_queens_beat_each_other(RemainingQueens, Queens).

move_queen_to_non_beaten_cell_and_update_state(queen(XF, YF), CurrState, NewState):-
    \+ beaten(cell(XF, YF), CurrState),
    NewState = CurrState.
move_queen_to_non_beaten_cell_and_update_state(queen(XF, YF), CurrState, NewState):-
    beaten(cell(XF, YF), CurrState),
    RowsAndColumns = [1, 2, 3, 4, 5, 6, 7, 8],
    member(X, RowsAndColumns),
    member(Y, RowsAndColumns),
    \+ beaten(cell(X, Y), CurrState, ignored_queen(XF, YF)),
    \+ occupied(cell(X, Y), CurrState),
    !,
    select(queen(XF, YF), CurrState, queen(X, Y), NewState).

solve(CurrState, _):-
    no_queens_beat_each_other(CurrState, CurrState),
    write(CurrState).
solve(CurrState, QueensMoved):-
    \+ no_queens_beat_each_other(CurrState, CurrState),
    NewQueensMoved is QueensMoved + 1,
    nth1(NewQueensMoved, CurrState, Queen),
    move_queen_to_non_beaten_cell_and_update_state(Queen, CurrState, NewState),
    solve(NewState, NewQueensMoved).