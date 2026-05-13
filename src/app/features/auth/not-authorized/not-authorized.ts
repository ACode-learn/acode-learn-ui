import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-not-authorized',
  imports: [Card],
  templateUrl: './not-authorized.html',
  styleUrl: './not-authorized.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotAuthorized {}
