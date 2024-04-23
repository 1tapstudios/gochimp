let game = null;

class Tile {
    constructor(btn, gameState) {
        this.gameState = gameState
        this.btn = btn
        this.unset()

        this.btn.onclick = () => { this.select() }
    }

    unset() {
        this.number = -1
        this.state = "unset"
        this.btn.textContent = " "
    }

    set(number) {
        this.number = number
        this.state = "set"
        this.btn.textContent = number
    }

    hide() {
        this.state = "hidden"
        this.btn.textContent = " "
    }

    select() {
        // Special handling for first tile click
        if (this.gameState.currentNumber === 1) {
            // Only check set tiles for first tile click
            if (this.state === "set") {
                // correct tile clicked hide the rest
                if (this.number === 1) {
                    this.gameState.incScore()
                    this.unset()
                    this.gameState.hideTiles()
                    this.gameState.next()
                }

                /// incorrect tile clicked alert user to click the first tile to start game
                else {
                    alert("Start by pressing 1")
                }
            }
        }

        // Subsequent tile clicks
        else {
            if (this.state === "hidden") {
                if (this.number === this.gameState.currentNumber) {
                    this.gameState.incScore()
                    this.unset()
                    this.gameState.next()
                } else {
                    this.gameState.hideTiles()
                    alert("Game over! You scored " + this.gameState.score)
                    game.reset()
                }
            }
        }
    }
}

class GameState {
    constructor(leadingCount, max, startNumber) {
        this.randomArray = new RandomArray(leadingCount, max)
        this.score = 0
        this.max = max
        this.leadingNumber = startNumber
        this.currentNumber = startNumber
        this.startNumber = startNumber
        this.tiles = []
        this.scoreDiv = document.getElementById("score")
        this.commentaryDiv = document.getElementById("commentary")
        this.hideTile = null
        
        let grid = document.getElementById("grid")
        for (let i = 0; i < this.max; i++) {
            let btn = grid.children[i]
            this.tiles.push(new Tile(btn, this))
        }
    }

    // Reset visual elements and initialize tile numbers
    reset() {
        this.leadingNumber = this.startNumber
        this.currentNumber = this.startNumber
        this.tiles = []
        this.randomArray.reset()
        this.resetScore()
        this.resetCommentary()
        this.init()
        this.hideTile = null
    }

    // Initialize tile numbers
    init() {
        for (const tileIndex of this.randomArray.array) {
            let tile = this.tiles[tileIndex]
            tile.set(this.leadingNumber)
            this.leadingNumber += 1
        }
    }

    next() {
        // hide the previously shown tile if it is set
        if (this.hideTile !== null) {
            this.hideTile.hide()
        }

        const nextTileIndex = this.randomArray.next()
        this.tiles[nextTileIndex].set(this.leadingNumber)
        this.hideTile = this.tiles[nextTileIndex]
        this.leadingNumber += 1
    }
    
    resetScore() {
        this.score = 0
        this.scoreDiv.textContent = `Score: ${this.score}`
    }
    
    resetCommentary() {
        this.commentaryDiv.textContent = ""
        this.commentaryDiv.classList.remove('snap-text')
    }

    incScore() {
        this.score += 1
        this.currentNumber += 1
        this.scoreDiv.textContent = `Score: ${this.score}`
        if (this.score == 2) {
            this.commentaryDiv.classList.add('snap-text')
            this.commentaryDiv.textContent = "Awesome!"
            // setTimeout(() => { this.resetCommentary() }, 1000);
        } else if (this.score == 10) {
            this.commentaryDiv.textContent = "Slayy Gurrl!"
            setTimeout(() => { this.resetCommentary() }, 1000);
        }
    }

    hideTiles() {
        for (const tile of this.tiles) {
            if (tile.state === "set") {
                tile.hide()
            }
        }
    }
}

class RandomArray {
    constructor(length, max) {
        this.length = length
        this.max = max
        this.array = []
        this.init()
    }
    
    reset() {
        this.array = []
        this.init()
    }

    init() {
        while (this.array.length < this.length) {
            const randomNumber = this.getRandomNumber();
            if (!this.array.includes(randomNumber)) {
                this.array.push(randomNumber);
            }
        }
    }

    next() {
        let nextNumber = this.getRandomNumber();
        while (this.array.includes(nextNumber)) {
            nextNumber = this.getRandomNumber();
        }
        this.array.shift();
        this.array.push(nextNumber);
        return nextNumber;
    }

    getRandomNumber() {
        return Math.floor(Math.random() * this.max)
    }
}

// Usage example
game = new GameState(5, 9, 1)
game.init()
