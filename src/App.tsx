import React, {useState} from 'react';
import axios from "axios";
import 'react-notifications-component/dist/theme.css'
import {ReactNotifications, Store} from 'react-notifications-component'

interface ColorModel{
    name: string,
    hex: string,
    luminance: number
}

const CardComponent = (props: ColorModel) => {
    const textColor = props.luminance<65?'white':'black';

    return (
        <>
            <div
                className="flex flex-col justify-center p-6 w-60 h-30 rounded-lg border border-black shadow-black shadow-sm"
                style={{
                    background:props.hex,
                    color: textColor
                }}
                onClick={()=>{
                    navigator.clipboard.writeText(props.name+'\t'+ props.hex);
                    Store.removeAllNotifications();
                    Store.addNotification({
                        title: "Success!",
                        message: 'Copied '+props.name+' to clipboard',
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: true
                        }
                    });
                }}
            >
                <div className={'font-bold text-center cursor-pointer'}>
                    {props.name}
                </div>
                <div className={'font-bold text-center cursor-pointer'}>
                    {props.hex}
                </div>
            </div>
        </>
    );
}

function App() {


    const [colors, setColors] = useState<ColorModel[]>([]);

    const onChangeSearch = (event: React.FormEvent<HTMLInputElement>) => {
        const searchValue = event.currentTarget.value;

        axios
            .get('https://api.color.pizza/v1/names/'+searchValue)
            .then((response)=>{
                setColors(
                    response.data.colors
                );
            })
        ;
    }

    return (
        <div className="App">
            <ReactNotifications/>
            <div className={'container mx-auto p-4 mt-4'}>
                <form className="flex gap-2 items-center max-w-md mx-auto">
                    <label htmlFor="simple-search" className="sr-only">Search</label>
                    <div className="relative w-full">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                 fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                        <input type="text" id="simple-search"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="Search" onChange={onChangeSearch} required/>
                    </div>
                    <button
                        data-tooltip-target="tooltip-light"
                        data-tooltip-style="light"
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={'w-5 h-5'} fill="currentColor"
                             viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                  d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z"/>
                            <path
                                d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z"/>
                        </svg>
                    </button>
                </form>

                <div className={'flex flex-wrap justify-center gap-4 mt-2 p-2'}>
                    {
                        colors.map((color) => {
                            return (
                                <>
                                    <CardComponent
                                        name={color.name}
                                        hex={color.hex}
                                        luminance={color.luminance}
                                    />
                                </>
                            );
                        })
                    }
                </div>
            </div>

            <div id="tooltip-light" role="tooltip"
                 className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 shadow-sm opacity-0 tooltip">
                Tooltip content
                <div className="tooltip-arrow" data-popper-arrow/>
            </div>
        </div>
    );
}

export default App;
