import { Form, Formik } from "formik";
import { useAlert } from "react-alert";
import * as Yup from "yup";
import SourceService from "../../services/SourceService";
import Button from "../../ui/Button";
import Loader from "../../ui/Loader/Loader";
const RangeExtendedForm = ({ data, selectedRow, onClose, setLoading }) => {
	const alert = useAlert();
	return (
		<Formik
			initialValues={{
				nlower: 0,
				n: data.n !== null ? data.n : 15,
				pminus: data.pminus !== null ? data.pminus : 32.5,
				pplus: data.pplus !== null ? data.pplus : 50,
				lminus: data.lminus !== null ? data.lminus : 67.5,
				lplus: data.lplus !== null ? data.lplus : 85,
				f: 100,
			}}
			validationSchema={() => {
				return Yup.lazy((values) => {
					return Yup.object().shape({
						nlower: Yup.number()
							.min(0, "N lower must be 0.")
							.max(0, "N lower must be 0."),
						n: Yup.number()
							.lessThan(100, "N must be less than 100")
							.moreThan(
								values.nlower < 100 ? values.nlower : 0,
								"N must be bigger than " + values.nlower
							),
						pminus: Yup.number()
							.lessThan(100, "P- must be less than 100")
							.moreThan(
								values.n < 100 ? values.n : 0,
								"P- must be bigger than " + values.n
							),
						pplus: Yup.number()
							.lessThan(100, "P+ must be less than 100")
							.moreThan(
								values.pminus < 100 ? values.pminus : 0,
								"P+ must be bigger than " + values.pminus
							),
						lminus: Yup.number()
							.lessThan(100, "L- must be less than 100")
							.moreThan(
								values.pplus < 100 ? values.pplus : 0,
								"L- must be bigger than " + values.pplus
							),
						lplus: Yup.number()
							.lessThan(100, "L+ must be less than 100")
							.moreThan(
								values.lminus < 100 ? values.lminus : 0,
								"L+ must be bigger than " + values.lminus
							),
					});
				});
			}}
			onSubmit={(values, { setSubmitting }) => {
				const scoreRanges = {
					n: values.n,
					p: null,
					l: null,
					pminus: values.pminus,
					pplus: values.pplus,
					lminus: values.lminus,
					lplus: values.lplus,
					mode: "EXTENDED",
				};
				setSubmitting(true);
				SourceService.updateScoreRanges(selectedRow.id, scoreRanges)
					.then(() => {
						alert.info("Source ranges updated.");
						onClose();
					})
					.catch((e) => {
						if (e.response?.data && e.response.data?.message) {
							alert.error(e.response.data.message);
						} else {
							alert.error("There was error updating ranges!");
						}
						onClose();
					});
			}}
		>
			{({ errors, touched, values, handleChange, isSubmitting }) => (
				<Form className='grid content-center grid-cols-4 px-4 space-y-2 text-center place-content-center'>
					{/*N*/}
					<label htmlFor='N' className='pt-3 pl-4 text-lg font-bold text-left'>
						N
					</label>
					<input
						type='number'
						name='nlower'
						className='border border-gray-400 rounded'
						disabled
						value={values.nlower}
					></input>
					<label> &lt; X &le;</label>
					<input
						type='number'
						name='n'
						className='border border-gray-400 rounded '
						value={values.n}
						onChange={handleChange}
					></input>
					<div className='grid grid-cols-2 col-span-4 pl-8 text-sm text-center text-red-500'>
						<span>{errors.nlower && touched.nlower && errors.nlower}</span>
						<span>{errors.n && touched.n && errors.n}</span>
					</div>

					{/*P-*/}
					<label htmlFor='P-' className='pl-4 text-lg font-bold text-left'>
						P-
					</label>
					<input
						type='number'
						name='n'
						className='border border-gray-400 rounded '
						value={values.n}
						disabled
					></input>

					<label> &lt; X &le;</label>
					<input
						type='number'
						name='pminus'
						className='border border-gray-400 rounded '
						value={values.pminus}
						onChange={handleChange}
					></input>
					<div className='grid grid-cols-2 col-span-4 pl-8 text-sm text-center text-red-500'>
						<span></span>
						<span>{errors.pminus && touched.pminus && errors.pminus}</span>
					</div>
					{/*P+*/}
					<label htmlFor='P+' className='pl-4 text-lg font-bold text-left'>
						P+
					</label>
					<input
						type='number'
						name='pminus'
						className='border border-gray-400 rounded'
						disabled
						value={values.pminus}
					></input>
					<label> &lt; X &le;</label>
					<input
						type='number'
						name='pplus'
						className='border border-gray-400 rounded '
						value={values.pplus}
						onChange={handleChange}
					></input>
					<div className='grid grid-cols-2 col-span-4 pl-8 text-sm text-center text-red-500'>
						<span></span>
						<span>{errors.pplus && touched.pplus && errors.pplus}</span>
					</div>
					{/*L-*/}
					<label htmlFor='L-' className='pl-4 text-lg font-bold text-left'>
						L-
					</label>
					<input
						type='number'
						name='pplus'
						className='border border-gray-400 rounded'
						disabled
						value={values.pplus}
					></input>
					<label> &lt; X &le;</label>
					<input
						type='number'
						name='lminus'
						className='border border-gray-400 rounded '
						value={values.lminus}
						onChange={handleChange}
					></input>
					<div className='grid grid-cols-2 col-span-4 pl-8 text-sm text-center text-red-500'>
						<span></span>
						<span>{errors.lminus && touched.lminus && errors.lminus}</span>
					</div>
					{/*L+*/}
					<label htmlFor='L+' className='pl-4 text-lg font-bold text-left'>
						L+
					</label>
					<input
						type='number'
						name='lminus'
						className='border border-gray-400 rounded'
						disabled
						value={values.lminus}
					></input>
					<label> &lt; X &le;</label>
					<input
						type='number'
						name='lplus'
						className='border border-gray-400 rounded '
						value={values.lplus}
						onChange={handleChange}
					></input>
					<div className='grid grid-cols-2 col-span-4 pl-8 text-sm text-center text-red-500'>
						<span></span>
						<span>{errors.lplus && touched.lplus && errors.lplus}</span>
					</div>
					{/*F*/}
					<label htmlFor='F' className='pl-4 text-lg font-bold text-left'>
						F
					</label>
					<input
						type='number'
						name='lplus'
						className='border border-gray-400 rounded'
						disabled
						value={values.lplus}
					></input>
					<label> &lt; X &le;</label>
					<input
						type='number'
						name='f'
						className='border border-gray-400 rounded '
						value={values.f}
						disabled
					></input>
					<div className='flex justify-center col-span-4 mt-6 space-x-2 space'>
						<Button
							type='submit'
							dark={true}
							type={!isSubmitting && "submit"}
							className={`mt-2 ${isSubmitting && "hover:bg-gray-800"} w-24`}
						>
							{isSubmitting ? (
								<div className='mt-1.5 mb-0.5'>
									<Loader size='small' dark={true} />
								</div>
							) : (
								"Save"
							)}
						</Button>
						<Button className='mt-2' onClick={onClose}>
							Cancel
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default RangeExtendedForm;
