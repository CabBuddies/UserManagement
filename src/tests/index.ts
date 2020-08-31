import f from './sample';
const func1 = f(1);
const func2 = f(2);
const func3 = f(3);

export default function tests(){
    func3();
    func2();
    func1();
    func3();
    func2();
    func1();
}