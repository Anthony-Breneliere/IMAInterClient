import { Directive, ElementRef, OnDestroy, OnInit, AfterViewInit, Input, Renderer2 } from '@angular/core';


@Directive({
  selector: '[draggable]',
  host: {
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'onDragEnd($event)',
    '(drag)': 'onDrag($event)'
  }
})
export class DraggableDirective implements OnDestroy, OnInit, AfterViewInit {
  private Δx: number = 0;
  private Δy: number = 0;
  
  private canDrag:boolean = true;
  
  @Input('draggable')
  set draggable(val:any){
    if(val === undefined || val === null || val === '' ) return;
    this.canDrag = !!val;
  }
  private mustBePosition: Array<string> = ['absolute', 'fixed', 'relative'];
  constructor(
    private el: ElementRef, private renderer: Renderer2
  ) {
    
  }
  
  ngOnInit(): void {
    __ngRendererSetElementAttributeHelper(this.renderer, this.el.nativeElement, 'draggable', 'false');
  }
  
  ngAfterViewInit(){
    try {
      let position = window.getComputedStyle(this.el.nativeElement).position;
      if (this.mustBePosition.indexOf(position) === -1) {
        console.warn( this.el.nativeElement, 'Must be having position attribute set to ' + this.mustBePosition.join('|'));
      }
    } catch (ex) {
      console.error(ex);
    }
  }
  ngOnDestroy(): void {
    __ngRendererSetElementAttributeHelper(this.renderer, this.el.nativeElement, 'draggable', 'false');
  }
  
  onDragStart(event: MouseEvent) {
    this.Δx = event.x - this.el.nativeElement.offsetLeft;
    this.Δy = event.y - this.el.nativeElement.offsetTop;

  }

  onDrag(event: MouseEvent) {
    
  }

  onDragEnd(event: MouseEvent) {
      this.doTranslation(event.x, event.y);
    this.Δx = 0;
    this.Δy = 0;
  }

  doTranslation(x: number, y: number) {
    if (!x || !y) return;
    this.renderer.setStyle(this.el.nativeElement, 'top', (y - this.Δy) + 'px');
    this.renderer.setStyle(this.el.nativeElement, 'left', (x - this.Δx) + 'px');
  }
  

}
type AnyDuringRendererMigration = any;

function __ngRendererSplitNamespaceHelper(name: AnyDuringRendererMigration) {
    if (name[0] === ":") {
        const match = name.match(/^:([^:]+):(.+)$/);
        return [match[1], match[2]];
    }
    return ["", name];
}

function __ngRendererSetElementAttributeHelper(renderer: AnyDuringRendererMigration, element: AnyDuringRendererMigration, namespaceAndName: AnyDuringRendererMigration, value?: AnyDuringRendererMigration) {
    const [namespace, name] = __ngRendererSplitNamespaceHelper(namespaceAndName);
    if (value != null) {
        renderer.setAttribute(element, name, value, namespace);
    }
    else {
        renderer.removeAttribute(element, name, namespace);
    }
}
