let grid = document.getElementById("grid");
let scoreDisplay = document.getElementById("score");
let highScoreDisplay = document.getElementById("highScore");
let tiles = [];
let size = 4;
let score = 0;
let gamePaused = false;
let highScore = localStorage.getItem("highScore2048") || 0;

const colors = {
  2: "#eee4da", 4: "#ede0c8", 8: "#f2b179", 16: "#f59563",
  32: "#f67c5f", 64: "#f65e3b", 128: "#edcf72", 256: "#edcc61",
  512: "#edc850", 1024: "#edc53f", 2048: "#edc22e"
};

function createGrid() {
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${size}, 70px)`;
  grid.style.gridTemplateRows = `repeat(${size}, 70px)`;
  tiles = [];

  for (let i = 0; i < size * size; i++) {
    const div = document.createElement("div");
    div.className = "tile";
    grid.appendChild(div);
    tiles.push(div);
  }
}

function getIndex(r, c) {
  return r * size + c;
}

function getEmptyTiles() {
  return tiles.map((tile, i) => tile.innerText === "" ? i : null).filter(i => i !== null);
}

function addTile() {
  const empty = getEmptyTiles();
  if (!empty.length) return;
  const index = empty[Math.floor(Math.random() * empty.length)];
  tiles[index].innerText = Math.random() < 0.9 ? "2" : "4";
  updateTile(tiles[index]);
}

function updateTile(tile) {
  const val = parseInt(tile.innerText);
  tile.style.background = colors[val] || "#ccc0b3";
  tile.style.color = val > 4 ? "#f9f6f2" : "#776e65";
}

function moveRow(row) {
  let filtered = row.filter(val => val !== "");
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] = String(Number(filtered[i]) * 2);
      score += Number(filtered[i]);
      filtered[i + 1] = "";
    }
  }
  return filtered.filter(val => val !== "");
}

function move(direction) {
  let moved = false;

  if (["left", "right"].includes(direction)) {
    for (let r = 0; r < size; r++) {
      let row = [];
      for (let c = 0; c < size; c++) {
        row.push(tiles[getIndex(r, c)].innerText);
      }
      if (direction === "right") row.reverse();
      let newRow = moveRow(row);
      while (newRow.length < size) newRow.push("");
      if (direction === "right") newRow.reverse();
      for (let c = 0; c < size; c++) {
        const i = getIndex(r, c);
        if (tiles[i].innerText !== newRow[c]) moved = true;
        tiles[i].innerText = newRow[c];
        updateTile(tiles[i]);
      }
    }
  } else {
    for (let c = 0; c < size; c++) {
      let col = [];
      for (let r = 0; r < size; r++) {
        col.push(tiles[getIndex(r, c)].innerText);
      }
      if (direction === "down") col.reverse();
      let newCol = moveRow(col);
      while (newCol.length < size) newCol.push("");
      if (direction === "down") newCol.reverse();
      for (let r = 0; r < size; r++) {
        const i = getIndex(r, c);
        if (tiles[i].innerText !== newCol[r]) moved = true;
        tiles[i].innerText = newCol[r];
        updateTile(tiles[i]);
      }
    }
  }

  if (moved) {
    addTile();
    scoreDisplay.innerText = `Score: ${score}`;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore2048", highScore);
      highScoreDisplay.innerText = `High Score: ${highScore}`;
    }
  }
}

function startGame() {
  const playerName = document.getElementById("playerName").value.trim();
  if (!playerName) return alert("Enter your name!");
  size = parseInt(document.getElementById("gridSize").value);
  score = 0;
  scoreDisplay.innerText = "Score: 0";
  highScoreDisplay.innerText = `High Score: ${highScore}`;
  createGrid();
  addTile(); addTile();
}

function pauseGame() {
  gamePaused = true;
  alert("Game paused!");
}

function resumeGame() {
  if (!tiles.length) return;
  gamePaused = false;
  alert("Game resumed!");
}

function endGame() {
  if (!tiles.length) return;
  if (confirm("Are you sure you want to end the game?")) {
    score = 0;
    tiles.forEach(tile => {
      tile.innerText = "";
      updateTile(tile);
    });
    scoreDisplay.innerText = "Score: 0";
    alert("Game ended!");
  }
}

function restartGame() {
  if (!tiles.length) return;
  if (confirm("Restart the game?")) {
    startGame();
  }
}

function resetHighScore() {
  if (confirm("Are you sure you want to reset the high score?")) {
    localStorage.removeItem("highScore2048");
    highScore = 0;
    highScoreDisplay.innerText = "High Score: 0";
    alert("High score reset!");
  }
}

document.addEventListener("keydown", (e) => {
  if (gamePaused) return;
  if (e.key === "ArrowLeft") move("left");
  else if (e.key === "ArrowRight") move("right");
  else if (e.key === "ArrowUp") move("up");
  else if (e.key === "ArrowDown") move("down");
});

highScoreDisplay.innerText = `High Score: ${highScore}`;
createGrid();
