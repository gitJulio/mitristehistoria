import { InsertHistorialService, FORMA_DE_BUSQUEDA } from '../../../Services/Historial/insert-historial.service';
import { GetRelacionadosComponent } from '../../Grupos/get-relacionados/get-relacionados.component';
import { GetGuiaVendedorComponent } from '../../Vehiculos/get-guia-vendedor/get-guia-vendedor.component';
import { ViewProductosWhiComponent } from '../view-productos-whi/view-productos-whi.component';
import { AgregaCarritoComponent } from '../../agrega-carrito/agrega-carrito.component';
import { BarraSortComponent } from '../barra-sort/barra-sort.component';
//*********************************IMPORT*************************************
import { Component, OnInit, HostListener, Input, ViewChild, NgModule } from '@angular/core';
import { GetProductosByGruposService } from "../../../Services/Productos/get-productos-by-grupos.service";
import { GetProductoByOmService } from "../../../Services/Productos/get-producto-by-oem.service";
import { GetProductosByAtributosService } from "../../../Services/Productos/get-productos-by-atributos.service";
import { GetProductosByFiltrosService } from "../../../Services/Productos/get-productos-by-filtros.service";
import { ViewProductosComponent } from '../view-productos/view-productos.component';
import sort from 'fast-sort';
import { RelacionadosBacktraceComponent } from '../relacionados-backtrace/relacionados-backtrace.component';
import { Router } from '@angular/router';



//********************************ENUMERADORES********************************
export enum BUSQUEDA_TIPO {
  APLICACION = "1",
  GRUPOS = "2",
  INTERCAMBIOS = "3",
  ATRIBUTOS = "4",
  DIAGRAMAS = "5",
  FILTROS = "6"
}

//*********************************INJECTABLES**********************************
@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.css']
})

export class ListaProductosComponent implements OnInit {
  // searchText: string;
  @ViewChild('guia') guiaV: GetGuiaVendedorComponent;
  @ViewChild('sorBusqueda') sortBus: BarraSortComponent;
  @ViewChild('rela') relaV: GetRelacionadosComponent;
  @ViewChild('viewProducto') Pro_viewProducto: ViewProductosComponent;
  @ViewChild('viewProductoWHI') Pro_viewProductoWHI: ViewProductosWhiComponent;
  @ViewChild('BactraceModal') backtraceMod: RelacionadosBacktraceComponent;
  @ViewChild('boxPrecio') bxPrecio: AgregaCarritoComponent;
  textoFiltro: string;
  // @ViewChild('prelacionados') pR:GetRelacionadosComponent;
  text_busqueda: any = []
  controller_name = 'ListaProductosComponent'
  proMenu: boolean = true;
  box_loading: boolean = false;

  constructor(private Pro_productos: GetProductosByGruposService,
    private Pro_productos_oem: GetProductoByOmService,
    private Pro_productos_atributos: GetProductosByAtributosService,
    private Pro_productos_filtros: GetProductosByFiltrosService,
    private Pro_historial: InsertHistorialService,
    private Pro_ruta: Router
  ) {

  }

  //*****************************Variables**************************************
  @Input() tipo_busqueda: BUSQUEDA_TIPO;
  productos: any[] = []
  bloqueo: boolean = false;
  alertProductos = false;
  ///*******************************Eventos*************************************
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const posicion = (document.documentElement.scrollTop + document.documentElement.clientHeight);
    const tamanio = document.documentElement.scrollHeight;
    if (tamanio > 1000) {
      if (posicion > (document.documentElement.scrollHeight - 200) && !this.bloqueo) {
        if (this.productos.length > 0) {
          this.scrollPeticion();
        }
      }
    }
  }

  //***********************************FUNCIONES********************************
  async scrollPeticion() {
    this.box_loading = true;
    this.bloqueo = true;
    this.alertProductos = false;
    let data;

    if (Number(sessionStorage.getItem('id_page')) == 1) {
      this.limpiarProductos();
    }

    this.sortBus.verFiltro = false;
    switch (this.tipo_busqueda) {
      case BUSQUEDA_TIPO.APLICACION:
        data = await this.getProductosGrupos();
        break;
      case BUSQUEDA_TIPO.GRUPOS:
        data = await this.getProductosGrupos();
        break;
      case BUSQUEDA_TIPO.INTERCAMBIOS:
        data = await this.getProductosByOem();
        if (sessionStorage.getItem("valor_oem") == '0') {
          sessionStorage.setItem("oem_ref", JSON.stringify((data)))
          sessionStorage.setItem("valor_oem", '1')
        }
        data = await this.getProductosByOem();

        break;
      case BUSQUEDA_TIPO.ATRIBUTOS:
        data = await this.getProductoByAtributos();
        break;
      case BUSQUEDA_TIPO.FILTROS:
        data = await this.getProductosByFiltros();
        break;
      case BUSQUEDA_TIPO.DIAGRAMAS:
        data = await this.getProductosByOem();
        break;
    }

    //Seteo de valores
    if (data != null) {
      // console.log(data.length)
      if (data.length != this.productos.length && data.length) {
        this.productos = this.productos.concat(data);
      }
      if (data.length == 35) {
        this.productos = this.productos.concat(data);
      }
    }


    //Si es navegacion por historial
    if (!sessionStorage.getItem("es_historial")) {
      switch (this.Pro_ruta.url) {
        case '/AllasExpert/getMotores':
          await this.insertarHistorial(FORMA_DE_BUSQUEDA.ALLAS_EXPERT)
          break;
        case '/AllasSearch':
          await this.insertarHistorial(FORMA_DE_BUSQUEDA.ALLAS_SEARCH)
          break;
        case '/Intercambio':
          await this.insertarHistorial(FORMA_DE_BUSQUEDA.INTERCAMBIOS)
          break;
        case '/Atributos':
          await this.insertarHistorial(FORMA_DE_BUSQUEDA.ATRIBUTOS)
          break;
      }
    }

    //Cambio de paguina
    if (Number(sessionStorage.getItem('id_page')) >= 1) {
      let id_page = Number(sessionStorage.getItem('id_page'));
      id_page++;
      await sessionStorage.setItem('id_page', String(id_page));
    }

    if (Number(sessionStorage.getItem('id_page')) == 2) {
      window.scrollTo(0, 0);
    }

    //Validacion de existencia de producto
    if (this.productos.length == 0) {
      this.alertProductos = true;
    }

    //Libreacion de anclas de carga
    this.bloqueo = false;
    this.sortBus.verFiltro = true;
    this.box_loading = false;
  }

  insertarHistorial(tipo_busqueda: any) {
    this.Pro_historial.insertHistorial(tipo_busqueda).subscribe(item => {
    }, err => {
      // console.log(err)
    })
  }

  async getProductosGrupos() {
    return await this.Pro_productos.getProductos().catch(err => {
      // console.log(err)
    });
  }

  async getProductosByOem() {
    return await this.Pro_productos_oem.getProductosByOem().catch(err => {
      // console.log(err)
    });
  }

  async getProductoByAtributos() {
    if (sessionStorage.getItem('text_busqueda')) {
      this.text_busqueda = sessionStorage.getItem('text_busqueda').split(" ")
    }

    return await this.Pro_productos_atributos.getProductosByAtributos().catch(err => {
      // console.log(err);
    });
  }

  async getProductosByFiltros() {
    // Si es la primera paguina limpiamos los productos
    if (sessionStorage.getItem('id_page') == "1") {
      this.productos = []
    }

    return await this.Pro_productos_filtros.getProductosByFiltros().catch(err => {
      // console.log(err)
    });
  }

  limpiarProductos() {
    this.productos = []
  }

  sortResultado(p_sort) {
    switch (p_sort.tipo) {
      case 'asc':
        this.productos = sort(this.productos).asc(u => u[`${p_sort.campo}`]);
        break;
      case 'desc':
        this.productos = sort(this.productos).desc(u => u[`${p_sort.campo}`]);
        break;
    }
  }

  getGuiaVendedor(id_articulo: string, id_proveedor, manuCode: string, partType: any, posgruId: any) {
    this.guiaV.construirGuia(id_articulo, id_proveedor, manuCode, partType, posgruId, true);
  }

  getGruposRelacionados(id_grupo: string) {
    this.proMenu = true;
    setTimeout(() => {
      this.relaV.construirR(id_grupo);
    }, 500)
  }

  cargarProducto(p_producto) {

    // console.log(p_producto)
    this.proMenu = false;
    this.Pro_viewProducto.Producto = [];
    this.Pro_viewProducto.marca_img = p_producto.imagen_marca;
    this.Pro_viewProducto.Producto = 1;
    this.Pro_viewProducto.box_ticket = false;
    this.Pro_viewProducto.ver_relacionador = true;
    this.Pro_viewProducto.manuCode = p_producto.id_marca_api;
    this.Pro_viewProducto.partType = p_producto.id_grupo_api;
    this.Pro_viewProducto.posgruId = p_producto.id_posicion_whi;
    if (p_producto.id_proveedor == 3) {
      this.Pro_viewProducto.oem_original = p_producto.oem_original;
      this.Pro_viewProducto.id_articulo_api = p_producto.id_articulo_api;

      this.Pro_viewProducto.oem_o = "";
      this.Pro_viewProducto.oem_o = p_producto.oem_original;
      this.Pro_viewProducto.constructorMaestroWHI(p_producto)
      // this.Pro_viewProductoWHI.SmartPage(p_producto)
      // return

    } else {

      this.Pro_viewProducto.constructorMaestro(p_producto.id_articulo, p_producto.id_proveedor)
      this.Pro_viewProducto.oem_o = "";
      this.Pro_viewProducto.oem_o = p_producto.oem_original;
    }

    this.Pro_viewProducto.oem_o = p_producto.oem_original;
    this.Pro_viewProducto.oem(p_producto.oem_original)
  }

  ngOnInit() {
  }
  sumar(producto: any) {
    producto.cantidad_p = producto.cantidad_p + 1;
  }

  restar(producto) {
    if (producto.cantidad_p != 1) {
      producto.cantidad_p = producto.cantidad_p - 1;
    }
  }

  agregarCarrito(cant_p, producto: any) {
    this.bxPrecio.existe = false;
    this.bxPrecio.aportacion = false;
    this.bxPrecio.en_camino = false;
    this.bxPrecio.precio = 0;
    this.bxPrecio.data = [];
    this.bxPrecio.obtenerPrecio(cant_p, producto);

  }
  ModalRelaBacktraceP() {
    this.backtraceMod.productos = [];
    this.backtraceMod.getProductosGrupos();
    this.backtraceMod.re = 1;
  }
  FiltroBusca(dat) {
    this.textoFiltro = dat
  }
  //**************************************Imagenes******************************
  icoRelacionados = "https://allasrepuestos.com/servidorimagenes/catalogo_assets/opciones_row/relacionados-icon.png"
  icoBuyerGuie = "https://allasrepuestos.com/servidorimagenes/catalogo_assets/opciones_row/buyer-guie-icon.png"
  icoMenuIcon = "https://allasrepuestos.com/servidorimagenes/catalogo_assets/opciones_row/menu-icon.png"
}
