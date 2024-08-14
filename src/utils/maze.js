export default {
    startMazePath(maze) {
        let path = [];
        let rowIndex = maze.length - 1, colIndex = 0, dir = 'left';
        while (colIndex !== maze[0].length || rowIndex !== 0) {
            if (dir === 'left') {
                if (maze[rowIndex][colIndex].mirror === 1) {
                    path.push({'x': rowIndex, 'y': colIndex, 'm': 1, 'rotate': false});
                    maze[rowIndex][colIndex].rotate = true;
                    if (maze[rowIndex][colIndex][2] === 'Wall') break;
                    dir = 'up';
                    rowIndex++;
                } else if (maze[rowIndex][colIndex].mirror === 2) {
                    path.push({'x': rowIndex, 'y': colIndex, 'm': 2});
                    maze[rowIndex][colIndex].rotate = false;
                    if (maze[rowIndex][colIndex][0] === 'Wall') break;
                    dir = 'down';
                    rowIndex--;
                } else {
                    path.push({'x': rowIndex, 'y': colIndex});
                    if (maze[rowIndex][colIndex][1] === 'Wall') break;
                    colIndex++;
                }
            } else if (dir === 'right') {
                if (maze[rowIndex][colIndex].mirror === 1) {
                    path.push({'x': rowIndex, 'y': colIndex, 'm': 1});
                    maze[rowIndex][colIndex].rotate = false;
                    if (maze[rowIndex][colIndex][0] === 'Wall') break;
                    dir = 'down';
                    rowIndex--;
                } else if (maze[rowIndex][colIndex].mirror === 2) {
                    path.push({'x': rowIndex, 'y': colIndex, 'm': 1, 'rotate': false});
                    maze[rowIndex][colIndex].rotate = true;
                    if (maze[rowIndex][colIndex][2] === 'Wall') break;
                    dir = 'up';
                    rowIndex++;
                } else {
                    path.push({'x': rowIndex, 'y': colIndex});
                    if (maze[rowIndex][colIndex][3] === 'Wall') break;
                    colIndex--;
                }
            } else if (dir === 'up') {
                if (maze[rowIndex][colIndex].mirror === 1) {
                    path.push({'x': rowIndex, 'y': colIndex, 'm': 1});
                    maze[rowIndex][colIndex].rotate = false;
                    if (maze[rowIndex][colIndex][1] === 'Wall') break;
                    dir = 'left';
                    colIndex++;
                } else if (maze[rowIndex][colIndex].mirror === 2) {
                    path.push({'x': rowIndex, 'y': colIndex, 'm': 2});
                    maze[rowIndex][colIndex].rotate = false;
                    if (maze[rowIndex][colIndex][3] === 'Wall') break;
                    dir = 'right';
                    colIndex--;
                } else {
                    path.push({'x': rowIndex, 'y': colIndex});
                    if (maze[rowIndex][colIndex][2] === 'Wall') break;
                    rowIndex++;
                }
            } else if (dir === 'down') {
                if (maze[rowIndex][colIndex].mirror === 1) {
                    path.push({'x': rowIndex, 'y': colIndex, 'm': 1, 'rotate': true});
                    maze[rowIndex][colIndex].rotate = true;
                    if (maze[rowIndex][colIndex][3] === 'Wall') break;
                    dir = 'right';
                    colIndex--;
                } else if (maze[rowIndex][colIndex].mirror === 2) {
                    path.push({'x': rowIndex, 'y': colIndex, 'm': 2, 'rotate': true});
                    maze[rowIndex][colIndex].rotate = true;
                    if (maze[rowIndex][colIndex][1] === 'Wall') break;
                    dir = 'left';
                    colIndex++;
                } else {
                    path.push({'x': rowIndex, 'y': colIndex});
                    if (maze[rowIndex][colIndex][0] === 'Wall') break;
                    rowIndex--;
                }
            } else {
                console.log('Error');
            }
        }

        return [maze, path, rowIndex, colIndex];
    }
}