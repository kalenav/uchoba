function capBetweenZeroAndOne(num) {
    return Math.min(1, Math.max(0, num));
}

class Interval {
    _from;
    _to;
    _includingFrom;
    _includingTo;

    constructor({
        from,
        to,
        includingFrom,
        includingTo,
        open,
        closed,
        cap = true
    }) {
        if (from > to) {
            const fromSnapshot = from;
            from = to;
            to = fromSnapshot;
        }
        this._from = from;
        this._to = to;
        this._includingFrom = includingFrom ?? closed ?? !open ?? true;
        this._includingTo = includingTo ?? closed ?? !open ?? true;

        if (cap) {
            this._from = capBetweenZeroAndOne(this._from);
            this._to = capBetweenZeroAndOne(this._to);
        }
    }

    intersection(another) {
        if (this.isEmpty || another.isEmpty) {
            return emptyInterval;
        }

        const {
            thisStartsBeforeAnotherStarts,
            thisStartsAfterAnotherStarts,
            bothStartAtTheSamePoint,
            thisEndsBeforeAnotherEnds,
            thisEndsAfterAnotherEnds,
            bothEndAtTheSamePoint,
            thisStartsBeforeAnotherEnds,
            thisStartsAfterAnotherEnds,
            thisStartsAtTheSamePointAnotherEnds,
            thisEndsBeforeAnotherStarts,
            thisEndsAfterAnotherStarts,
            thisEndsAtTheSamePointAnotherStarts,
        } = this._getRelativeIntervalInfo(another);

        if (thisStartsAfterAnotherEnds || thisEndsBeforeAnotherStarts) {
            return emptyInterval;
        }

        if (
            (thisStartsBeforeAnotherStarts && thisEndsAfterAnotherEnds)
            || (bothStartAtTheSamePoint && thisEndsAfterAnotherEnds)
            || (bothEndAtTheSamePoint && thisStartsBeforeAnotherStarts)
        ) {
            return another;
        }

        if (
            (thisStartsAfterAnotherStarts && thisEndsBeforeAnotherEnds)
            || (bothStartAtTheSamePoint && thisEndsBeforeAnotherEnds)
            || (bothEndAtTheSamePoint && thisStartsAfterAnotherStarts)
        ) {
            return this;
        }

        if (thisStartsAtTheSamePointAnotherEnds) {
            return new Interval({ from: this.from, to: this.from, closed: true });
        }

        if (thisEndsAtTheSamePointAnotherStarts) {
            return new Interval({ from: this.to, to: this.to, closed: true });
        }

        if (thisEndsAfterAnotherStarts) {
            return new Interval({
                from: another.from,
                to: this.to,
                includingFrom: another.includingFrom,
                includingTo: this.includingTo
            });
        }

        if (thisStartsBeforeAnotherEnds) {
            return new Interval({
                from: this.from,
                to: another.to,
                includingFrom: this.includingFrom,
                includingTo: another.includingTo
            });
        }
    }

    asArray() {
        return [this._from, this._to];
    }

    get from() {
        return this._from;
    }

    get to() {
        return this._to;
    }

    get includingFrom() {
        return this._includingFrom;
    }

    get includingTo() {
        return this._includingTo;
    }

    get isEmpty() {
        return (this.from === this.to) && (!this.includingFrom || !this.includingTo);
    }

    get isSingleElementInterval() {
        return (this.from === this.to) && this.includingFrom && this.includingTo;
    }

    _getRelativeIntervalInfo(another) {
        const thisStartsBeforeAnotherStarts = this.from < another.from;
        const thisStartsAfterAnotherStarts = this.from > another.from;
        const bothStartAtTheSamePoint = this.from === another.from && this.includingFrom && another.includingFrom;

        const thisEndsBeforeAnotherEnds = this.to < another.to;
        const thisEndsAfterAnotherEnds = this.to > another.to;
        const bothEndAtTheSamePoint = this.to === another.to && this.includingTo && another.includingTo;

        const thisStartsBeforeAnotherEnds = this.from < another.to;
        const thisStartsAfterAnotherEnds = this.from > another.to;
        const thisStartsAtTheSamePointAnotherEnds = this.from === another.to && this.includingFrom && another.includingTo;

        const thisEndsBeforeAnotherStarts = this.to < another.from;
        const thisEndsAfterAnotherStarts = this.to > another.from;
        const thisEndsAtTheSamePointAnotherStarts = this.to === another.from && this.includingTo && another.includingFrom;

        return {
            thisStartsBeforeAnotherStarts,
            thisStartsAfterAnotherStarts,
            bothStartAtTheSamePoint,
            thisEndsBeforeAnotherEnds,
            thisEndsAfterAnotherEnds,
            bothEndAtTheSamePoint,
            thisStartsBeforeAnotherEnds,
            thisStartsAfterAnotherEnds,
            thisStartsAtTheSamePointAnotherEnds,
            thisEndsBeforeAnotherStarts,
            thisEndsAfterAnotherStarts,
            thisEndsAtTheSamePointAnotherStarts
        }
    }

    ///////////////////

    toString() {
        if (this.isEmpty) {
            return '∅';
        }

        if (this.isSingleElementInterval) {
            return `{${this.from}}`;
        }

        return this.includingFrom ? '[' : '('
            + this.from
            + ', '
            + this.to
            + this.includingTo ? ']' : ')';
    }
}
 
const emptyInterval = new Interval({ from: 0, to: 0, open: true });
const fromZeroToOne = new Interval({ from: 0, to: 1, closed: true });