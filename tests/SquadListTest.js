var o = require("ospec").default;
let squadList = require("./views/SquadList");


o.spec("squadlist", function() {
    let vnode = squadList.view();

    o(vnode.attrs.id).equals(1);
    o(vnode.attrs.id).equals(2);
    o(vnode.attrs.id).equals(3);
    o(vnode.attrs.id).equals(4);
    o(vnode.attrs.id).equals(5);
    o(vnode.attrs.id).equals(6);
    o(vnode.attrs.id).equals(7);
    o(vnode.attrs.id).equals(8);
    o(vnode.attrs.id).equals(9); /// PROBLEM WITH AVG CALC
    o(vnode.attrs.id).equals(10);

})