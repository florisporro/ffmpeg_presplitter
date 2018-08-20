// The grid library provides a variety of functions to keep track of our queue,
// perform resolution calculations and validations.

class Grid {
  constructor() {
    this.cols = 0;
    this.rows = 0;
    this.screen_width = 0;
    this.screen_height = 0;
    this.cells = [];
    this.rows_as_letters = false;
  }

  setup(total_width, total_height, screen_width, screen_height, columnnames) {
    this.cells = [];
    // Validate the input to make sure we don't get half pixels
    if (Number.isInteger(total_width / screen_width) === false) throw(new Error("Invalid grid!"));
    if (Number.isInteger(total_height / screen_height) === false) throw(new Error("Invalid grid!"));

    if (columnnames === 'Columns as letters') {
      this.rows_as_letters = false;
    } else if (columnnames === 'Rows as letters') {
      this.rows_as_letters = true;
    }

    this.screen_width = screen_width;
    this.screen_height = screen_height;
    this.cols = Number(total_width / screen_width);
    this.rows = Number(total_height / screen_height);

    var i = 0;

    // Iterate over rows
    for (let row = 0; row < this.rows; row++) {
      // Iterate over columns
      for (let col = 0; col < this.cols; col++) {
        if (this.rows_as_letters) {
          
          var title = this.int_to_alphabet(row)+String("000" + Number(col+1)).slice(-2);
        } else {
          var title = this.int_to_alphabet(col)+String("000" + Number(row+1)).slice(-2);
        }

        this.cells.push({
          id: i,
          title: title,
          column: col,
          row: row,
          enabled: false,
          status: 'ready'
        });
        i++;
      }
    }
    return true;
  }

  /**
   * Takes a column number integer and returns an alphabet-based
   * name.
   *
   * @param {*} int
   * @returns
   * @memberof Grid
   */
  int_to_alphabet(int) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    var letters = Math.floor(int/26);

    if (letters > 0) {
      return alphabet[letters-1] + alphabet[int-letters*26];
    } else {
      return alphabet[int];
    }
  }

  /**
   * Takes a column number and a row number
   * and returns the cell object
   *
   * @param {int} x
   * @param {int} y
   * @returns cell
   * @memberof Grid
   */
  cell_by_coords(x, y) {
    var cell = this.cells.find(cell => {
      return ((cell.column === x) && (cell.row === y))
    });
    return cell;
  }

  /**
   * Takes a cell object and returns the X and Y coordinates
   * of the top-left ancherpoint of that screen
   *
   * @param {object} cell
   * @returns {x, y}
   * @memberof Grid
   */
  crop_dimensions(cell) {
    return { 
      x: cell.column * this.screen_width,
      y: cell.row * this.screen_height
    }
  }
}

// var the_grid = new Grid();
// the_grid.setup(24320, 4320, 1280, 720);
// console.log(the_grid.cells);
// console.log(the_grid.crop_dimensions(the_grid.cells[20]));

module.exports = new Grid();