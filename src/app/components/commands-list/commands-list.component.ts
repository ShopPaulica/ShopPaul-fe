import {DecimalPipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Component} from '@angular/core';

@Component({
  selector: 'app-commands-list',
  imports: [NgForOf, NgIf, NgOptimizedImage, DecimalPipe],
  standalone: true,
  templateUrl: './commands-list.component.html',
  styleUrl: './commands-list.component.scss'
})
export class commandsListComponent {

}
