import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, TextInput } from 'react-native';
import { Provider as PaperProvider, Appbar } from 'react-native-paper';

class TicTac extends Component {
  constructor(props) {
    super(props);
    // Initial state
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      player1: '',
      player2: '',
      gameStarted: false,
      winnerLine: [],
    };
  }

  // Function to handle clicks on the squares
  handleClick(i) {
    const squares = this.state.squares.slice();
    // Check if there's a winner, if game started, or if the square is already filled
    if (!this.state.gameStarted || calculateWinner(squares, this.state.player1, this.state.player2) || squares[i]) {
      return;
    }
    // Update the clicked square with 'X' or 'O' based on whose turn it is
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // Check for the winner
    const winner = calculateWinner(squares, this.state.player1, this.state.player2);
    let winnerLine = [];
    if (winner) {
      winnerLine = getWinnerLine(squares);
    }
    // Update the state with the new squares array, toggle xIsNext for the next turn, and set winnerLine
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
      winnerLine: winnerLine,
    });
  }

  // Function to restart the game
  restartGame() {
    this.setState({
      // Reset the game to default values
      squares: Array(9).fill(null),
      xIsNext: true,
      gameStarted: false,
      winnerLine: [],
    });
  }

  // Function to start the game with provided player names
  startGame() {
    if (this.state.player1 && this.state.player2) {
      this.setState({ gameStarted: true });
    }
  }

  // Function to render the squares while playing
  renderSquare(i) {
    const winnerLine = this.state.winnerLine;
    return (
      // Render individual squares as TouchableOpacity for user interaction
      <TouchableOpacity
        style={[styles.square, winnerLine.includes(i) && styles.winnerSquare]}
        onPress={() => this.handleClick(i)}
      >
        <Text style={styles.squareText}>
          {this.state.squares[i]}
        </Text>
      </TouchableOpacity>
    );
  }

  // Function to render everything inside the component
  render() {
    const winner = calculateWinner(this.state.squares, this.state.player1, this.state.player2);
    let status;
    // Set the game status based on the winner or draw or next player turn
    if (!this.state.gameStarted) {
      status = `Enter Player Names and Start Game`;
    } else if (winner) {
      status = `Winner: ${winner === 'X' ? this.state.player1 : this.state.player2}`;
    } else if (this.state.squares.every((square) => square !== null)) {
      status = 'Draw!';
    } else {
      status = `Next player: ${this.state.xIsNext ? this.state.player1 : this.state.player2}`;
    }

    // Return the entire game screen layout
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Tic Tac Toe
        </Text>
        {!this.state.gameStarted && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Player 1 Name"
              onChangeText={(text) => this.setState({ player1: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Player 2 Name"
              onChangeText={(text) => this.setState({ player2: text })}
            />
            <Button
              title="Start Game"
              onPress={() => this.startGame()}
            />
          </View>
        )}
        {this.state.gameStarted && (
          <View>
            <View style={styles.row}>
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </View>
            <View style={styles.row}>
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </View>
            <View style={styles.row}>
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </View>
            <Text style={styles.status}>
              {status}
            </Text>
            <Button
              title="Restart Game"
              onPress={() => this.restartGame()}
              style={styles.restartButton}
            >
              <Text style={styles.restartButtonText}>Restart Game</Text>
            </Button>
          </View>
        )}
      </View>
    );
  }
}

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#11D8FC',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color:'white',
  },
  square: {
    width: 100,
    height: 100,
    backgroundColor: '#ECEFF1', // Background color for squares
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5, // Add margin between squares
    borderRadius: 10, // Add border radius for rounded corners
  },
  winnerSquare: {
    backgroundColor: 'yellow', // Change color for winner squares
  },
  squareText: {
    fontSize: 40,
  },
  status: {
    marginVertical: 20,
    fontSize: 20,
  },
  restartButton: {
    marginTop: 20,
    backgroundColor: '#FF5722', // Change button background color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  restartButtonText: {
    color: 'white', // Change button text color
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
    // marginTop: 100,
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 200,
  },
  row: {
    flexDirection: 'row',
  },
});

// Function to determine the winner
function calculateWinner(squares, player1, player2) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // Check if any winning combination matches
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Return the winner 'X' or 'O'
    }
  }
  return null; // Return null if there's no winner
}

// Function to get the winning line
function getWinnerLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c]; // Return the winning line
    }
  }
  return []; // Return an empty array if there's no winner
}

// Main app component
export default function App() {
  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="TicTac"/>
      </Appbar.Header>
      <TicTac />
    </PaperProvider>
  );
}
