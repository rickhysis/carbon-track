import SVGEelement from "@/types/svg"

const LiskIcon: React.FC<SVGEelement> = ({ addClassName }) => {
    return (

        <svg className={addClassName} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 276 326">
            <title>lisk</title>
            <path d="M138.16,0L108.88,48.7,214.58,229.84,128.83,326s67.4-.4,67,0S276,235.43,276,235.43ZM99.71,66.66L0,236.23,78.57,326h29.55l43.2-50.28h-48L61,228.65l67.8-115.31Z" style={{fill: '#04183d'}} />
        </svg>
    )
}

export default LiskIcon