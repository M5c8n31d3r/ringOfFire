// import { Component, OnInit } from '@angular/core';
// import { Game } from 'src/models/game';
// import { MatDialog } from '@angular/material/dialog';
// import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

// @Component({
//   selector: 'app-game',
//   templateUrl: './game.component.html',
//   styleUrls: ['./game.component.scss']
  
// })


// export class GameComponent implements OnInit {
//   pickCardAnimation = false;
//   currentCard: string = '';
//   game: Game = new Game();


//   constructor(public dialog: MatDialog) { }


//   ngOnInit(): void {
//     this.newGame();
//   }


//   newGame() {
//   this.game = new Game();
//   console.log(this.game);
//   }


//   takeCard() {
//     if (!this.pickCardAnimation) {
//          this.currentCard = this.game.stack.pop();
//          console.log(this.currentCard);
//          this.pickCardAnimation = true;
         
//          console.log('New card: ' + this.currentCard);
//          console.log('Game is', this.game);

//          this.game.currentPlayer++;
//          this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;


//     setTimeout(()=>{
//       this.game.playedCards.push(this.currentCard);
//       this.pickCardAnimation = false;
//      }, 1000);
//     }
//    }


//    openDialog(): void {
//     const dialogRef = this.dialog.open(DialogAddPlayerComponent);

//     dialogRef.afterClosed().subscribe((name: string)=> {
//       console.log('The dialog was closed', name);

//       if ( name && name.length > 0){
//       this.game.players.push(name);
//       }
//     });
//   }

// }





import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, collectionData, doc, docData, getFirestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})


export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  games$: Observable<any[]>;
  game: Game = new Game();
  gameId: string;
  games: Array<any>;



  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog
  ) {
    const itemCollection = collection(this.firestore, 'games');
    this.games$ = collectionData(itemCollection);
  }


  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params['id']);
      this.gameId = params['id'];

      this.loadGame(this.gameId);
    });
  }


  newGame() {
  this.game = new Game();
  console.log(this.game);
  }


  loadGame(gameId) {
    const gameRef: any = doc(this.firestore, 'games', gameId);
    this.games$ = docData(gameRef);
    this.games$.subscribe((game: any) => {
      console.log('my game', game);
      this.game.currentPlayer = game.currentPlayer;
      this.game.playedCards = game.playedCards;
      this.game.players = game.players;
      this.game.stack = game.stack;
      this.game.pickCardAnimation = game.pickCardAnimation;
      this.game.currentCard = game.currentCard;
    });
  }


  takeCard() {
    if (!this.pickCardAnimation) {
         this.currentCard = this.game.stack.pop();
         console.log(this.currentCard);
         this.pickCardAnimation = true;
         
         console.log('New card: ' + this.currentCard);
         console.log('Game is', this.game);

         this.game.currentPlayer++;
         this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;


    setTimeout(()=>{
      this.game.playedCards.push(this.currentCard);
      this.pickCardAnimation = false;
     }, 1000);
    }
   }


   openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string)=> {
      console.log('The dialog was closed', name);

      if ( name && name.length > 0){
      this.game.players.push(name);
      }
    });
  }

  
  saveGame() {
    const db = getFirestore();
    const docRef = doc(db, 'games', this.gameId);
    updateDoc(docRef, this.game.toJson()).then((res) => {
      console.log('Speichern erfolgreich! ', res);
    });
  }
}

