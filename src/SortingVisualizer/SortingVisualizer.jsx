import React, { useState } from 'react';
import './SortingVisualizer.css';


export default function SortingVisualizer() {

    const PRIMARY_COLOR = 'turquoise';
    const SECONDARY_COLOR = 'red';
    const ANIMATION_SPEED_MS = 5;
    const [myarray, setmyarray] = useState()
    const [finarr, setfinarr] = useState([])
    const [showinput, setshowinput] = useState(false)
    const [len, setlen] = useState(0)
    var [x, setx] = useState(0)
    //const animation = []

    const handlesizesubmit = (e) => {
        e.preventDefault()
        var arr = myarray.split(",")
        arr = arr.map(item => {
            return (
                parseInt(item)
            )
        })
        setfinarr(arr)
        setshowinput(true)
    }

    const merge = (a, lb, mid, ub, animations) => {
        var i = lb
        var j = mid + 1
        console.log('i,j', i, j)
        var k = lb
        var currarr = []
        while (i <= mid && j <= ub) {
            animations.push([i, j]);//to select elements we are compairing
            animations.push([i, j]);//to change their color back to turqoise
            if (a[i] <= a[j]) {

                animations.push([k, a[i]]);
                currarr[k] = a[i]
                i = i + 1
            }
            else {
                animations.push([k, a[j]]);
                currarr[k] = a[j]
                j = j + 1
            }
            k = k + 1
        }
        if (i > mid) {

            while (j <= ub) {
                animations.push([j, j]);
                animations.push([j, j]);
                animations.push([k, a[j]]);
                currarr[k] = a[j]
                j = j + 1
                k = k + 1
            }
        }
        if (j > ub) {
            while (i <= mid) {
                animations.push([i, i]);//only sorted elements so no need to compare
                animations.push([i, i]);
                animations.push([k, a[i]]);
                currarr[k] = a[i]
                i = i + 1
                k = k + 1
            }
        }
        for (var m = lb; m < k; m++) {
            a[m] = currarr[m]
            console.log(m, a[m])
        }

    }

    const MergeSort = (a, lb, ub, animations) => {
        //split only if array has atleast two elements
        if (lb < ub) {
            var midnum = Math.floor((lb + ub) / 2)
            console.log('mid=', midnum)
            MergeSort(a, lb, midnum, animations)
            MergeSort(a, midnum + 1, ub, animations)
            merge(a, lb, midnum, ub, animations) //merging the splitted arrays
        }
    }

    function getMergeSortAnimations(array) {
        const animations = [];
        if (array.length <= 1) return array;
        MergeSort(array, 0, array.length - 1, animations);
        return animations;
    }

    function MergeSortAlgo() {
        const animations = getMergeSortAnimations(finarr)
        console.log(animations)
        for (let i = 0; i < animations.length; i++) {
            const arrayBars = document.getElementsByClassName('array-bar');
            const isColorChange = i % 3 !== 2;//because every third element(2,5,8,11....) we are changing the final array position
            console.log(isColorChange, i)
            if (isColorChange) {
                const [barOneIdx, barTwoIdx] = animations[i];
                const barOneStyle = arrayBars[barOneIdx].style;
                const barTwoStyle = arrayBars[barTwoIdx].style;
                const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
                setTimeout(() => {
                    barOneStyle.backgroundColor = color;
                    barTwoStyle.backgroundColor = color;
                }, i * ANIMATION_SPEED_MS);
            } else {
                setTimeout(() => {
                    const [barOneIdx, newHeight] = animations[i];
                    const barOneStyle = arrayBars[barOneIdx].style;
                    barOneStyle.height = `${newHeight}px`;
                    //arrayBars[barOneIdx].innerHTML = `${newHeight}`
                }, i * ANIMATION_SPEED_MS);
            }
        }
    }

    function GenerateRand() {

        var arr = []
        var val = 0
        for (let i = 0; i < 100; i++) {
            val = Math.floor(Math.random() * 50);
            arr.push(val)
        }
        console.log(arr);
        setfinarr(arr)
        setshowinput(true)
    }

    function Partition(a, lb, ub, animations) {
        var left, right, temp, loc, flag
        loc = left = lb
        right = ub
        flag = 0
        while (flag != 1) {
            while (a[loc] <= a[right] && loc != right) {
                animations.push([loc, right, 'noswap'])
                animations.push([loc, right, 'noswap', 'change'])
                right = right - 1
            }
            if (loc == right) {
                flag = 1
            }
            else if (a[loc] > a[right]) {

                temp = a[loc]
                a[loc] = a[right]
                a[right] = temp
                animations.push([loc, right, 'swap', a[loc], a[right]])
                loc = right
            }
            if (flag != 1) {
                while (a[loc] >= a[left] && loc != left) {
                    animations.push([loc, left, 'noswap'])
                    animations.push([loc, left, 'noswap', 'change'])
                    left = left + 1
                }
                if (loc == left) {
                    flag = 1
                }
                else if (a[loc] < a[left]) {

                    temp = a[loc]
                    a[loc] = a[left]
                    a[left] = temp
                    animations.push([loc, left, 'swap', a[loc], a[left]])
                    loc = left
                }
            }
        }
        return loc
    }

    function QuickSort(a, lb, ub, animations) {
        // console.log('quick sort', a, lb, ub)
        var loc = 0;
        if (lb < ub) {
            loc = Partition(a, lb, ub, animations)
            QuickSort(a, lb, loc - 1, animations)
            QuickSort(a, loc + 1, ub, animations)
        }
        console.log('quick sort', a)
    }

    function getQuickSortAnimations(array) {
        const animations = [];
        if (array.length <= 1) return array;
        QuickSort(array, 0, array.length - 1, animations);
        return animations;
    }

    function QuickSortAlgo() {
        const animations = getQuickSortAnimations(finarr)
        console.log(animations)
        for (let i = 0; i < animations.length; i++) {
            const arrayBars = document.getElementsByClassName('array-bar');
            const [barOneIdx, barTwoIdx, isswap, ischange] = animations[i]
            if (isswap == "noswap") {
                const [barOneIdx, barTwoIdx] = animations[i];
                const barOneStyle = arrayBars[barOneIdx].style;
                const barTwoStyle = arrayBars[barTwoIdx].style;
                const color = ischange !== 'change' ? SECONDARY_COLOR : PRIMARY_COLOR;
                setTimeout(() => {
                    barOneStyle.backgroundColor = color;
                    barTwoStyle.backgroundColor = color;
                }, i * ANIMATION_SPEED_MS);
            } else {
                setTimeout(() => {
                    const [barOneIdx, barTwoIdx, isswap, newHeightOne, newHeightTwo] = animations[i];
                    const barOneStyle = arrayBars[barOneIdx].style;
                    const barTwoStyle = arrayBars[barTwoIdx].style;
                    barOneStyle.height = `${newHeightOne}px`;
                    barTwoStyle.height = `${newHeightTwo}px`

                }, i * ANIMATION_SPEED_MS);
            }
        }

    }

    function InsertionSort(array, n, animations) {
        var x = [];
        for (var i = 1; i < n; i++) {
            var temp = array[i];
            var j = i - 1;
            animations.push([i, j, 'noswap', 'nochange'])
            animations.push([i, j, 'noswap', 'change'])
            if (temp < array[j]) {
                while (temp < array[j] && j >= 0) {
                    animations.push([j + 1, 'swap', array[j]])
                    array[j + 1] = array[j]
                    j = j - 1
                }

                array[j + 1] = temp
                animations.push([j + 1, 'swap', temp])
            } else {
                animations.push([i, j, 'noswap', 'change'])
            }

        }
        console.log('sorted array is ', array)
    }


    function getInsertionSortAnimations(array) {
        const animations = [];
        if (array.length <= 1) return array;
        InsertionSort(array, array.length, animations);
        return animations;
    }

    function InsertionSortAlgo() {
        const animations = getInsertionSortAnimations(finarr)
        console.log(animations)
        for (let i = 0; i < animations.length; i++) {
            const arrayBars = document.getElementsByClassName('array-bar');
            const [barOneIdx, barTwoIdx, isswap, ischange] = animations[i]
            if (isswap == "noswap") {
                const [barOneIdx, barTwoIdx, isswap, change] = animations[i];
                const barOneStyle = arrayBars[barOneIdx].style;
                const barTwoStyle = arrayBars[barTwoIdx].style;
                const color = change !== 'change' ? SECONDARY_COLOR : PRIMARY_COLOR;
                setTimeout(() => {
                    barOneStyle.backgroundColor = color;
                    barTwoStyle.backgroundColor = color;
                }, i * ANIMATION_SPEED_MS);
            } else {
                setTimeout(() => {
                    const [barOneIdx, isswap, newHeightOne] = animations[i];
                    const barOneStyle = arrayBars[barOneIdx].style;
                    barOneStyle.height = `${newHeightOne}px`;
                }, i * ANIMATION_SPEED_MS);
            }
        }
    }

    function BubbleSort(array, n, animations) {
        var temp = 0
        for (var i = 0; i < n; i++) {

            for (var j = 0; j < n - i - 1; j++) {
                animations.push([i, j, 'noswap', 'nochange'])
                animations.push([i, j, 'noswap', 'change'])
                if (array[j] > array[j + 1]) {
                    animations.push([j, j + 1, 'swap', array[j + 1], array[j]])
                    temp = array[j]
                    array[j] = array[j + 1]
                    array[j + 1] = temp
                }
            }
        }
        console.log('sorted array is', array)
    }

    function getBubbleSortAnimations(array) {
        const animations = [];
        if (array.length <= 1) return array;
        BubbleSort(array, array.length, animations);
        return animations;
    }

    function BubbleSortAlgo() {
        const animations = getBubbleSortAnimations(finarr)
        console.log(animations)
        for (let i = 0; i < animations.length; i++) {
            const arrayBars = document.getElementsByClassName('array-bar');
            const [barOneIdx, barTwoIdx, isswap, ischange] = animations[i]
            if (isswap == "noswap") {
                const [barOneIdx, barTwoIdx] = animations[i];
                const barOneStyle = arrayBars[barOneIdx].style;
                const barTwoStyle = arrayBars[barTwoIdx].style;
                const color = ischange !== 'change' ? SECONDARY_COLOR : PRIMARY_COLOR;
                setTimeout(() => {
                    barOneStyle.backgroundColor = color;
                    barTwoStyle.backgroundColor = color;
                }, i * ANIMATION_SPEED_MS);
            } else {
                setTimeout(() => {
                    const [barOneIdx, barTwoIdx, isswap, newHeightOne, newHeightTwo] = animations[i];
                    const barOneStyle = arrayBars[barOneIdx].style;
                    const barTwoStyle = arrayBars[barTwoIdx].style;
                    barOneStyle.height = `${newHeightOne}px`;
                    barTwoStyle.height = `${newHeightTwo}px`

                }, i * ANIMATION_SPEED_MS);
            }
        }
    }

    return (
        <div>
            <form>
                <input type="text" placeholder="Enter array e.g 1,2,3,4" onChange={(e) => setmyarray(e.target.value)}></input>
                <input type="text" placeholder="Enter len" onChange={(e) => setlen(e.target.value)}></input>
                <button onClick={(e) => handlesizesubmit(e)}>Submit</button>
            </form>
            <button onClick={() => { MergeSortAlgo() }}>Merge Sort</button>
            <button onClick={() => { BubbleSortAlgo() }}>Bubble Sort</button>
            <button onClick={() => { QuickSortAlgo() }}>Quick Sort</button>
            <button onClick={() => { InsertionSortAlgo() }}>Insertion Sort</button>
            <button onClick={GenerateRand}>Generate a random array</button>
            {
                showinput ?
                    <div className="array-container">
                        {
                            finarr.map((value, idx) => {
                                return (
                                    <div
                                        className="array-bar"
                                        key={idx}
                                        style={{
                                            backgroundColor: PRIMARY_COLOR,
                                            height: `${value}px`,
                                        }}></div>
                                )
                            })
                        }
                    </div>
                    :
                    <>
                    </>
            }
            {console.log('length', len)}
        </div>

    );

}



